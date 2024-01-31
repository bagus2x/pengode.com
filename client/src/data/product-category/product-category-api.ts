import axios from '@pengode/common/axios'
import { Cursor, Page } from '@pengode/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const createProductCategory = async (req: { name: string }) => {
  const url = `${BASE_URL}/product-category`
  const res = await axios.auth.post<ProductCategory>(url, req)

  return res.data
}

export const getProductCategories = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/product-categories`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.get<Page<ProductCategory>>(url.toString())

  return res.data
}
