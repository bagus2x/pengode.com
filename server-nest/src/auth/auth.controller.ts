import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
} from '@pengode/auth/auth.dto'
import { AuthService } from '@pengode/auth/auth.service'
import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { RefreshTokenGuard } from '@pengode/auth/utils/refresh-token-guard'

@Controller('/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  @UseGuards(AccessTokenGuard)
  current(@Req() request: Request) {
    return request.user
  }

  @Post('/signup')
  @HttpCode(201)
  @ApiCreatedResponse({ type: AuthResponse })
  signUp(@Body() req: SignUpRequest): Promise<AuthResponse> {
    return this.authService.signUp(req)
  }

  @Post('/signin')
  @ApiOkResponse({ type: AuthResponse })
  signIn(@Body() req: SignInRequest): Promise<AuthResponse> {
    return this.authService.signIn(req)
  }

  @Post('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: AuthResponse })
  refresh() {
    return this.authService.refreshTokens()
  }

  @Delete('/signout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  @ApiOkResponse({ type: AuthResponse })
  signOut(): Promise<void> {
    return this.authService.signOut()
  }
}
