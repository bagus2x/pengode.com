'use server'

import { del, get, post, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'
import { Product } from '@pengode/data/product'
import { Cursor, Page } from '@pengode/data/types'

export async function addProduct(req: { productId: number }) {
  return await withAuth(post)<Product>({
    url: `${env('PENGODE_API_BASE_URL')}/product-cart`,
    body: req,
  })
}

export async function getProducts(req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/product-cart`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  return await withAuth(get)<Page<Product>>({ url })
}

export async function removeProduct(productId: number) {
  return await withAuth(del)<Product>({
    url: `${env('PENGODE_API_BASE_URL')}/product-cart/${productId}`,
  })
}
