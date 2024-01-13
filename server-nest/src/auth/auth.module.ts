import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthController } from '@pengode/auth/auth.controller'
import { AuthService } from '@pengode/auth/auth.service'
import { AuthUser } from '@pengode/auth/utils/auth-user'
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@pengode/auth/utils/token-strategy'
import { User } from '@pengode/user/user'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    CacheModule.register({ isGlobal: true }),
  ],
  providers: [AuthUser, AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
