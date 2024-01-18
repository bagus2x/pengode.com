import { Controller, Get, Header } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserService } from '@pengode/user/user.service'
import { ClsService } from 'nestjs-cls'

@Controller()
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly clsService: ClsService,
  ) {}

  @Get('/users')
  @Header('Content-Type', 'application/json')
  getUsers() {
    return this.userService.findAll()
  }

  @Get('/hello')
  hello() {
    return this.clsService.get('userId')
  }
}
