import axios from '@pengode/common/axios'
import { ProductReview } from '@pengode/data/product-review/product-review'
import { Cursor, Page } from '@pengode/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const createProductReview = async (req: {
  productId: number
  description?: string | null
  star: number
}) => {
  const url = `${BASE_URL}/product-review`
  const res = await axios.auth.post(url, req)

  return res.data
}

export const getProductReviewsByAuthUser = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/user/product-reviews`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.auth.get<Page<ProductReview>>(url.toString())

  return res.data
}

export const getProductReviewByAuthUserAndProduct = async (
  productId: number,
) => {
  const url = `${BASE_URL}/product/${productId}/product-review`
  const res = await axios.auth.get<ProductReview>(url)

  return res.data
}
