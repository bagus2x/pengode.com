import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

import { User } from '@pengode/user/user'
import { UserResponse } from '@pengode/user/user.dto'

export class SignUpRequest {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string

  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty()
  username: string

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  @ApiProperty()
  password: string

  @IsNotEmpty()
  @MaxLength(64)
  name: string
}

export class SignInRequest {
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty()
  username: string

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  @ApiProperty()
  password: string
}

export class AuthResponse {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  user: UserResponse

  static create({
    accessToken,
    refreshToken,
    user,
  }: {
    accessToken: string
    refreshToken: string
    user: User
  }): AuthResponse {
    return {
      accessToken,
      refreshToken,
      user: UserResponse.create(user),
    }
  }
}

export class SocialRequest {
  @IsNotEmpty()
  @ApiProperty()
  token: string
}
