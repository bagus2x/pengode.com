import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export class PageResponse<T> {
  items: T[]
  nextCursor: number
}

export class PageRequest<T = unknown> {
  size: number = 10
  cursor: number = Number.MAX_VALUE
  filter?: T
}

export const PageParam = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PageRequest => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query

    const size = parseInt(query.size) || 10
    const cursor = parseInt(query.cursor) || Math.pow(2, 31) - 1
    return { size, cursor }
  },
)
