import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { IsNumber, ValidateNested } from 'class-validator'

export class PageResponse<T> {
  items: T[]
  nextCursor: number
}

export class PageRequest<T = unknown> {
  @IsNumber()
  size: number = 10

  @IsNumber()
  cursor: number = Math.pow(2, 31) - 1

  @ValidateNested({ each: true })
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
