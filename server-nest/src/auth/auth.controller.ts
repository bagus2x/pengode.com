import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
  SocialRequest,
} from '@pengode/auth/auth.dto'
import { AuthService } from '@pengode/auth/auth.service'
import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { RefreshTokenGuard } from '@pengode/auth/utils/refresh-token-guard'

@Controller('/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('/github')
  @ApiOkResponse({ type: AuthResponse })
  github(@Body() req: SocialRequest): Promise<AuthResponse> {
    return this.authService.github(req)
  }

  @Post('/google')
  @ApiOkResponse({ type: AuthResponse })
  google(@Body() req: SocialRequest): Promise<AuthResponse> {
    return this.authService.google(req)
  }

  @Post('/refresh-token')
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: AuthResponse })
  refresh(): Promise<AuthResponse> {
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
