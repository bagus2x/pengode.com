'use server'

import {
  del,
  get,
  patch,
  post,
  put,
  withAuth,
} from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'
import { Cursor, Page } from '@pengode/data/types'

export type Status = 'VISIBLE' | 'INVISIBLE'

export interface Product {
  id: number
  title: string
  description: string
  previewUrl: string
  price: string
  status: Status
  discount?: number | null
  categories: {
    id: number
    name: string
  }[]
  logs: {
    id: number
    name: string
    productUrl: string
    description: string
    createdAt: Date
  }[]
  owner: {
    id: number
    email: string
    username: string
    name: string
    photo?: string | null
  }
  numberOfOneStars: number
  numberOfTwoStars: number
  numberOfThreeStars: number
  numberOfFourStars: number
  numberOfFiveStars: number
  numberOfBuyers: number
  liked?: boolean
  paid?: boolean
  createdAt: string
}

export async function createProduct(req: {
  title: string
  description: string
  previewUrl: string
  price: string
  discount?: number | null
  status: 'VISIBLE' | 'INVISIBLE'
  categoryIds: number[]
}) {
  return await withAuth(post)<Product>({
    url: `${env('PENGODE_API_BASE_URL')}/product`,
    body: req,
  })
}

export async function getProducts(req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: ('VISIBLE' | 'INVISIBLE')[]
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/products`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)
  if (req?.statuses) {
    req?.statuses.forEach((statusId) => {
      url.searchParams.append('statuses', `${statusId}`)
    })
  }

  return await withAuth(get)<Page<Product>>({ url })
}

export async function getBoughtProducts(req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: ('VISIBLE' | 'INVISIBLE')[]
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/user/bought-products`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)
  if (req?.statuses) {
    req?.statuses.forEach((statusId) => {
      url.searchParams.append('statuses', `${statusId}`)
    })
  }

  return await withAuth(get)<Page<Product>>({ url })
}

export async function getLikedProducts(req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: ('VISIBLE' | 'INVISIBLE')[]
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/user/liked-products`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)
  if (req?.statuses) {
    req?.statuses.forEach((statusId) => {
      url.searchParams.append('statuses', `${statusId}`)
    })
  }

  return await withAuth(get)<Page<Product>>({ url })
}

export async function getProduct(productId: number) {
  return await withAuth(get)<Product>({
    url: `${env('PENGODE_API_BASE_URL')}/product/${productId}`,
  })
}

export async function addLike(productId: number) {
  return await withAuth(patch)<Product>({
    url: `${env('PENGODE_API_BASE_URL')}/product/${productId}/like`,
  })
}

export async function removeLike(productId: number) {
  return await withAuth(del)<Product>({
    url: `${env('PENGODE_API_BASE_URL')}/product/${productId}/like`,
  })
}

export async function updateProduct(
  productId: number,
  req: {
    title: string
    description: string
    previewUrl: string
    price: string
    discount?: number | null
    status: 'VISIBLE' | 'INVISIBLE'
    categoryIds: number[]
  },
) {
  return await withAuth(put)<Product>({
    url: `${env('PENGODE_API_BASE_URL')}/product/${productId}`,
    body: req,
  })
}
