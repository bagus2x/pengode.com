import {
  CanActivate,
  ExecutionContext,
  Inject,
  Type,
  mixin,
} from '@nestjs/common'
import { DataSource } from 'typeorm'
import { FastifyRequest } from 'fastify'

import { User } from '@pengode/user/user'
import { JwtPayload } from '@pengode/auth/utils/token-strategy'
import { ClsService } from 'nestjs-cls'

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload
  }
}

export const SomeRolesGuard = (...roles: string[]): Type<CanActivate> => {
  class RolesGuardMixin {
    constructor(
      @Inject(DataSource) private readonly dataSource: DataSource,
      private readonly clsService: ClsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user: userFromPayload } = context
        .switchToHttp()
        .getRequest<FastifyRequest>()
      if (!userFromPayload) return !!userFromPayload

      const user = await this.dataSource.manager.findOne(User, {
        where: { id: this.clsService.get<number>('userId') },
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
    constructor(
      @Inject(DataSource) private readonly dataSource: DataSource,
      private readonly clsService: ClsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user: userFromPayload } = context
        .switchToHttp()
        .getRequest<FastifyRequest>()
      if (!userFromPayload) return !!userFromPayload

      const user = await this.dataSource.manager.findOne(User, {
        where: { id: this.clsService.get<number>('userId') },
      })

      return roles.every((roleName) => {
        return user.roles.some((role) => role.name === roleName)
      })
    }
  }

  return mixin(RolesGuardMixin)
}
