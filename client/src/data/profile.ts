'use server'

import { get, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'

interface ProfileResponse {
  id: number
  user: {
    email: string
    username: string
  }
  name: string
  photo: string
  updatedAt: string
  createdAt: string
}

export async function getCurrentProfile() {
  return await withAuth(get)<ProfileResponse>({
    url: `${env('PENGODE_API_BASE_URL')}/profile`,
  })
}
