import {
  CanActivate,
  ExecutionContext,
  Inject,
  Type,
  mixin,
} from '@nestjs/common'
import { DataSource } from 'typeorm'

import { User } from '@pengode/user/user'
import { Request } from 'express'

export const SomeRolesGuard = (...roles: string[]): Type<CanActivate> => {
  class RolesGuardMixin {
    constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user: userFromPayload } = context
        .switchToHttp()
        .getRequest<Request>()
      if (!userFromPayload) return !!userFromPayload

      const user = await this.dataSource.manager.findOne(User, {
        where: { id: userFromPayload.userId },
      })

      return user.roles.some((role) => {
        return roles.includes(role.name)
      })
    }
  }

  return mixin(RolesGuardMixin)
}

export const EveryRolesGuard = (...roles: string[]): Type<CanActivate> => {
  class RolesGuardMixin {
    constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user: userFromPayload } = context
        .switchToHttp()
        .getRequest<Request>()
      if (!userFromPayload) return !!userFromPayload

      const user = await this.dataSource.manager.findOne(User, {
        where: { id: userFromPayload.userId },
      })

      return roles.every((roleName) => {
        return user.roles.some((role) => role.name === roleName)
      })
    }
  }

  return mixin(RolesGuardMixin)
}
