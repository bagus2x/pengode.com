import { CacheModule } from '@nestjs/cache-manager'
import { ConflictException, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { redisStore } from 'cache-manager-redis-store'
import { Repository } from 'typeorm'

import { AuthController } from '@pengode/auth/auth.controller'
import { AuthService } from '@pengode/auth/auth.service'
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@pengode/auth/utils/token-strategy'
import { Role } from '@pengode/role/role'
import { User } from '@pengode/user/user'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({}),
    CacheModule.register({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(configService.get<string>('REDIS_PORT')!),
          },
        })
        return {
          store: () => store,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    try {
      const email = this.configService.get<string>('ADMIN_EMAIL')
      const username = this.configService.get<string>('ADMIN_USERNAME')
      const password = this.configService.get<string>('ADMIN_PASSWORD')

      const exists = await this.userRepository.existsBy({ username })
      if (exists) return

      const roles = await Promise.all(
        Role.ROLES.map(async (roleName) => {
          return await this.roleRepository.findOneByOrFail({ name: roleName })
        }),
      )
      const user = await this.userRepository.save({
        email,
        username,
        password: await bcrypt.hash(password, 10),
        name: username,
        roles,
      })

      console.log(`initial admin ${user.username} has been created`)
    } catch (error) {
      if (!(error instanceof ConflictException)) {
        throw error
      }
    }
  }
}
