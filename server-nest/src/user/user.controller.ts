import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClsService } from 'nestjs-cls'

import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageResponse } from '@pengode/common/dtos'
import { FindAllRequest, UserResponse } from '@pengode/user/user.dto'
import { UserService } from '@pengode/user/user.service'

@Controller()
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly clsService: ClsService,
  ) {}

  @Get('/users')
  @UseGuards(AccessTokenGuard)
  @ApiResponse({ type: PageResponse<UserResponse> })
  findAll(req: FindAllRequest): Promise<PageResponse<UserResponse>> {
    return this.userService.findAll(req)
  }

  @Get('/user')
  @UseGuards(AccessTokenGuard)
  @ApiResponse({ type: UserResponse })
  findByAuth(): Promise<UserResponse> {
    return this.userService.findById(this.clsService.get<number>('userId'))
  }

  @Get('/user/:userId')
  @UseGuards(AccessTokenGuard)
  @ApiResponse({ type: UserResponse })
  findById(@Param('userId') userId: number): Promise<UserResponse> {
    return this.userService.findById(userId)
  }
}
