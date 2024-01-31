import { useInfiniteQuery } from '@tanstack/react-query'
import axios from '@pengode/common/axios'
import { env } from '@pengode/common/utils'
import { Cursor, Page } from '@pengode/data/types'
import { User } from '@pengode/data/user/user'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const useGetUsersQuery = ({
  size,
  search,
}: {
  size?: number
  search?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: useGetUsersQuery.key(size, search),
    queryFn: async ({ pageParam }) => {
      return await getUsers({ cursor: { nextCursor: pageParam }, size, search })
    },
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
  })
}

useGetUsersQuery.key = (size?: number, search?: string) => [
  'GET_INFINITE_USERS',
  size,
  search,
]

// API Function

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
