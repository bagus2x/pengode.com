'use server'

import { get, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'
import { Cursor, Page } from '@pengode/data/types'

export interface User {
  id: number
  email: string
  username: string
  phone?: string | null
  name: string
  photo: string
  roles: { id: number; name: string }[]
}

export async function getAuthUser() {
  return await withAuth(get)<User>({
    url: `${env('PENGODE_API_BASE_URL')}/user`,
  })
}

export async function getUsers(req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/users`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  return await withAuth(get)<Page<User>>({ url })
}
