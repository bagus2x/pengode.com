import axios from '@pengode/common/axios'
import { Product } from '@pengode/data/product/product'
import { Cursor, Page } from '@pengode/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const addProduct = async (req: { productId: number }) => {
  const url = `${BASE_URL}/product-cart`
  const res = await axios.auth.post<Product>(url, req)

  return res.data
}

export const getProducts = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/product-cart`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.auth.get<Page<Product>>(url.toString())

  return res.data
}

export const removeProduct = async (productId: number) => {
  const url = `${BASE_URL}/product-cart/${productId}`
  const res = await axios.auth.delete<Product>(url.toString())

  return res.data
}
