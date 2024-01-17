import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-store'

import { AuthController } from '@pengode/auth/auth.controller'
import { AuthService } from '@pengode/auth/auth.service'
import { AuthUser } from '@pengode/auth/utils/auth-user'
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@pengode/auth/utils/token-strategy'
import { User } from '@pengode/user/user'
import { Role } from '@pengode/role/role'

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
  providers: [AuthUser, AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
