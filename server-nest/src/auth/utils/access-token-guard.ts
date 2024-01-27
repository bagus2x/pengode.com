import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}

export class OptionalAccessTokenGuard extends AuthGuard('jwt') {
  override handleRequest(_err: any, user: any) {
    return user
  }
}
