import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator'

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

class UserResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

  @ApiProperty()
  name: string

  @ApiProperty()
  photo: string
}

export class AuthResponse {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  user: UserResponse
}
