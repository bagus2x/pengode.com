import axios from '@pengode/common/axios'
import { ProductLog } from '@pengode/data/product-log/product-log'
import { Cursor, Page } from '@pengode/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const createProductLog = async (req: {
  name: string
  productUrl: string
  description: string
  productId: number
}) => {
  const url = `${BASE_URL}/product-log`
  const res = await axios.auth.post<ProductLog>(url, req)

  return res.data
}

export const getProductLogs = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/product-logs`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.auth.post<Page<ProductLog>>(url.toString())

  return res.data
}

export const updateProductLog = async (
  logId: number,
  req: {
    name: string
    productUrl: string
    description: string
    productId: number
  },
) => {
  const url = `${BASE_URL}/product-log/${logId}`
  const res = await axios.auth.put<ProductLog>(url, req)

  return res.data
}
