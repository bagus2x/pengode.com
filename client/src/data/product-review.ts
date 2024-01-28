'use server'

import { get, post, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'
import { Product } from '@pengode/data/product'
import { Cursor, Page } from '@pengode/data/types'
import { User } from '@pengode/data/user'

export interface ProductReview {
  id: number
  reviewer: User
  product: Product
  description: string
  star: number
  createdAt: Date
  updatedAt: Date
}

export async function createProductReview(req: {
  productId: number
  description?: string | null
  star: number
}) {
  return await withAuth(post)<ProductReview>({
    url: `${env('PENGODE_API_BASE_URL')}/product-review`,
    body: req,
  })
}

export async function getProductReviewsByAuthUser(req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/user/product-reviews`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  return await withAuth(get)<Page<ProductReview>>({ url })
}

export async function getProductReviewByAuthUserAndProductId(
  productId: number,
) {
  return await withAuth(get)<ProductReview>({
    url: `${env('PENGODE_API_BASE_URL')}/product/${productId}/product-review`,
  })
}
