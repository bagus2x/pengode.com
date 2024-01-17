import { Module, OnModuleInit } from '@nestjs/common'
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm'
import { Role } from '@pengode/role/role'

import { RoleController } from '@pengode/role/role.controller'
import { RoleService } from '@pengode/role/role.service'
import { Repository } from 'typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  onModuleInit() {
    Role.ROLES.forEach(async (roleName) => {
      const exists = !!(await this.roleRepository.findOneBy({ name: roleName }))
      if (exists) return

      await this.roleRepository.save({ name: roleName })
    })
  }
}
