export class PageResponse<T> {
  items: T[]
  nextCursor: number
}

export class PageRequest<T = unknown> {
  size: number = 10
  cursor: number = Number.MAX_VALUE
  filter?: T
}
