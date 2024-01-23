'use server'

import { get, post, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'
import { Cursor, Page } from '@pengode/data/types'

export interface ProductLog {
  id: number
  name: string
  productUrl: string
  description: string
  product: {
    id: number
    title: string
    previewUrl: string
    price: string
    discount?: number | null
  }
  createdAt: string
  updatedAt: string
}

export async function createLog(req: {
  name: string
  productUrl: string
  description: string
  productId: number
}) {
  return await withAuth(post)<ProductLog>({
    url: `${env('PENGODE_API_BASE_URL')}/product-log`,
    body: req,
  })
}

export async function getLogs(req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/product-logs`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await withAuth(get)<Page<ProductLog>>({ url })
  return res
}

export async function updateLog(
  logId: number,
  req: {
    name: string
    productUrl: string
    description: string
    productId: number
  },
) {
  return await withAuth(post)<ProductLog>({
    url: `${env('PENGODE_API_BASE_URL')}/product-log/${logId}`,
    body: req,
  })
}
