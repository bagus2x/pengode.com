import { Controller, Get, Header } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserService } from '@pengode/user/user.service'

@Controller()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  @Header('Content-Type', 'application/json')
  getUsers() {
    return this.userService.getUsers()
  }
}
