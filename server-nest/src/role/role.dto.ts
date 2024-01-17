import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@pengode/role/role'

export class RoleResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  static build(role: Role): RoleResponse {
    return {
      id: role.id,
      name: role.name,
    }
  }
}
