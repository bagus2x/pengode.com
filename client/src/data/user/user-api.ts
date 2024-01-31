'use server'

import axios from '@pengode/common/axios'
import { Cursor, Page } from '@pengode/data/types'
import { User } from '@pengode/data/user/user'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const getAuthUser = async () => {
  const url = `${BASE_URL}/user`
  const res = await axios.auth.get<User>(url)
  return res.data
}

export const getUsers = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/users`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.auth.get<Page<User>>(url.toString())

  return res.data
}
