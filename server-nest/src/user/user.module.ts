import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@pengode/user/user'
import { UserController } from '@pengode/user/user.controller'
import { UserService } from '@pengode/user/user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
