import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Role } from '@pengode/role/role'
import { RoleResponse } from '@pengode/role/role.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<RoleResponse[]> {
    const roles = await this.roleRepository.find()
    return roles.map(RoleResponse.build)
  }
}
