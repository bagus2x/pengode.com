import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '@pengode/auth/auth.module'
import { env } from '@pengode/common/utils'
import { User } from '@pengode/user/user'
import { UserModule } from '@pengode/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: env('DB_USERNAME'),
      password: env('DB_PASSWORD'),
      database: env('DB_NAME'),
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
