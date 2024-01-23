'use server'

import { get, post, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'
import { Cursor, Page } from '@pengode/data/types'

interface ProductCategory {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export async function createCategory(req: { name: string }) {
  return await withAuth(post)<ProductCategory>({
    url: `${env('PENGODE_API_BASE_URL')}/product-category`,
    body: req,
  })
}

export async function getCategories(req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/product-categories`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await withAuth(get)<Page<ProductCategory>>({ url })
  return res
}
