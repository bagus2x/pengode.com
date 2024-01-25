'use server'

import { get, post, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'
import { Cursor, Page } from '@pengode/data/types'

export type Status = 'PENDING' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELED'

export interface ProductInvoice {
  id: number
  status: Status
  customer: {
    id: number
    email: string
    username: string
    phone: string
    name: string
    photo: string
  }
  items: ProductInvoiceItem[]
  grossAmount: string
  token: string
  redirectUrl: string
  histories: {
    id: number
    status: Status
    createdAt: string
  }
  createdAt: string
}

export async function createInvoice(req: { productIds: number[] }) {
  return await withAuth(post)<ProductInvoice>({
    url: `${env('PENGODE_API_BASE_URL')}/product-invoice`,
    body: req,
  })
}

export async function getInvoices(req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/product-invoices`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await withAuth(get)<Page<ProductInvoice>>({ url })
  return res
}

export async function getInvoice(invoiceId: number) {
  return await withAuth(get)<ProductInvoice>({
    url: `${env('PENGODE_API_BASE_URL')}/product-invoice/${invoiceId}`,
  })
}
