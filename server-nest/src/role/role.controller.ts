import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { RoleResponse } from '@pengode/role/role.dto'

import { RoleService } from '@pengode/role/role.service'

@Controller()
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/roles')
  @ApiOkResponse({ type: Array<RoleResponse> })
  findAll(): Promise<RoleResponse[]> {
    return this.roleService.findAll()
  }
}
