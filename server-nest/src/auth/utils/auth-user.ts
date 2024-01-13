import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      sub: string
      userId: number
      username: string
      refreshToken?: string
    }
  }
}

@Injectable({ scope: Scope.REQUEST })
export class AuthUser {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  get user() {
    return this.request.user
  }
}
