export interface Cursor {
  previousCursor?: number
  nextCursor?: number
}

export interface Page<T> extends Cursor {
  size: number
  items: T[]
}

export interface RestError {
  message: string | string[]
  error: string
  statusCode: number
}
