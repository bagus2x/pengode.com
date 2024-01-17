import { ApiProperty } from '@nestjs/swagger'
import { User } from '@pengode/user/user'

export class UserResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  username: string

  phone?: string | null

  name: string

  photo: string

  roles: { id: number; name: string }[]

  static build(user: User): UserResponse {
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
