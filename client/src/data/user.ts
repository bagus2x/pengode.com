'use server'

import { get, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'

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
