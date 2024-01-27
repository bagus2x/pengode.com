import { ApiProperty } from '@nestjs/swagger'
import { PageRequest } from '@pengode/common/dtos'
import { User } from '@pengode/user/user'
import { IsOptional } from 'class-validator'

export class FindAllRequest extends PageRequest {
  @IsOptional()
  @ApiProperty()
  search?: string
}

export class UserResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

  @ApiProperty()
  phone?: string | null

  @ApiProperty()
  name: string

  @ApiProperty()
  photo: string

  @ApiProperty()
  roles: { id: number; name: string }[]

  static create(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      name: user.name,
      photo: user.phone,
      roles: user.roles,
    }
  }
}
