import { cache } from 'react'

import axios from '@pengode/common/axios'
import { ProductInvoice } from '@pengode/data/product-invoice/product-invoice'
import { Cursor, Page } from '@pengode/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const createInvoice = async (req: { productIds: number[] }) => {
  const url = `${BASE_URL}/product-invoice`
  const res = await axios.auth.post<ProductInvoice>(url, req)

  return res.data
}

export const getInvoices = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/product-invoices`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.auth.get<Page<ProductInvoice>>(url.toString())

  return res.data
}

export const getInvoicesByAuthUser = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/user/product-invoices`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.auth.get<Page<ProductInvoice>>(url.toString())

  return res.data
}

export const getInvoice = cache(async (invoiceId: number) => {
  const url = `${BASE_URL}/product-invoice/${invoiceId}`
  const res = await axios.auth.get<ProductInvoice>(url)

  return res.data
})
