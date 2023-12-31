import { auth } from '@pengode/auth'

const getBearer = async () => {
  const session = await auth()

  if (!session?.user.accessToken) return

  return `Bearer ${session.user.accessToken}`
}

export type RestClientRequest = Omit<RequestInit, 'body'> & {
  url: string | URL | globalThis.Request
  body?: any
}

export class RestError<T> extends Error {
  constructor(
    readonly res: Response,
    readonly message: string,
    readonly data: T,
  ) {
    super(message)
  }
}

export const withAuth = (
  method: <T>(req: RestClientRequest) => Promise<T>,
): (<T>(req: RestClientRequest) => Promise<T>) => {
  return async (req) => {
    const bearer = await getBearer()
    if (bearer) {
      req.headers = {
        ...req.headers,
        Authorization: bearer,
      }
    }

    return await method(req)
  }
}

export async function get<T>({
  url,
  body,
  headers,
  ...customInit
}: RestClientRequest): Promise<T> {
  let init: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customInit,
  }

  if (
    body &&
    init.headers &&
    (init.headers as Record<any, any>)['Content-Type'] === 'application/json'
  ) {
    init = {
      ...init,
      body: JSON.stringify(body),
    }
  }

  const res = await fetch(url, init)
  const data = await res.json()

  if (!res.ok) {
    throw new RestError(
      res,
      'Failed to get ' + JSON.stringify({ data, url }),
      data,
    )
  }

  return data
}

export async function post<T>({
  url,
  body,
  headers,
  ...customInit
}: RestClientRequest): Promise<T> {
  let init: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...customInit,
  }

  if (
    body &&
    init.headers &&
    (init.headers as Record<any, any>)['Content-Type'] === 'application/json'
  ) {
    init = {
      ...init,
      body: JSON.stringify(body),
    }
  }

  const res = await fetch(url, init)
  const data = await res.json()

  if (!res.ok) {
    throw new RestError(
      res,
      'Failed to post:' + JSON.stringify({ data, url }),
      data,
    )
  }

  return data
}

export async function put<T>({
  url,
  body,
  headers,
  ...customInit
}: RestClientRequest): Promise<T> {
  let init: RequestInit = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...customInit,
  }

  if (
    body &&
    init.headers &&
    (init.headers as Record<any, any>)['Content-Type'] === 'application/json'
  ) {
    init = {
      ...init,
      body: JSON.stringify(body),
    }
  }

  const res = await fetch(url, init)
  const data = await res.json()

  if (!res.ok) {
    throw new RestError(
      res,
      'Failed to put ' + JSON.stringify({ url, data }),
      data,
    )
  }

  return data
}

export async function patch<T>({
  url,
  body,
  headers,
  ...customInit
}: RestClientRequest): Promise<T> {
  let init: RequestInit = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...customInit,
  }

  if (
    body &&
    init.headers &&
    (init.headers as Record<any, any>)['Content-Type'] === 'application/json'
  ) {
    init = {
      ...init,
      body: JSON.stringify(body),
    }
  }

  const res = await fetch(url, init)
  const data = await res.json()

  if (!res.ok) {
    throw new RestError(
      res,
      'Failed to patch ' + JSON.stringify({ data, url }),
      data,
    )
  }

  return data
}

export async function del<T>({
  url,
  body,
  headers,
  ...customInit
}: RestClientRequest): Promise<T> {
  let init: RequestInit = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...customInit,
  }

  if (
    body &&
    init.headers &&
    (init.headers as Record<any, any>)['Content-Type'] === 'application/json'
  ) {
    init = {
      ...init,
      body: JSON.stringify(body),
    }
  }

  const res = await fetch(url, init)
  const data = await res.json()

  if (!res.ok) {
    throw new RestError(
      res,
      'Failed to delete ' + JSON.stringify({ data, url }),
      data,
    )
  }

  return data
}
