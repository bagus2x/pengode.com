import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { env } from '@pengode/common/utils'
import { ClsService } from 'nestjs-cls'

export type JwtPayload = {
  userId: number
  sub: string
  username: string
  refreshToken?: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly clsService: ClsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env('JWT_ACCESS_SECRET'),
    })
  }

  validate(payload: JwtPayload) {
    this.clsService.set('userId', payload.userId)
    return payload
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly clsService: ClsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  validate(req: FastifyRequest, payload: JwtPayload) {
    const refreshToken = req.headers.authorization.replace('Bearer', '').trim()
    this.clsService.set('userId', payload.userId)
    this.clsService.set('refreshToken', refreshToken)

    return payload
  }
}
