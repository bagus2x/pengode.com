export interface Cursor {
  previousCursor?: number
  nextCursor?: number
}

export interface Page<T> extends Cursor {
  size: number
  items: T[]
}
