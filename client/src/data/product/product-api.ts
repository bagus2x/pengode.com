import axios from '@pengode/common/axios'
import { Product } from '@pengode/data/product/product'
import { Cursor, Page } from '@pengode/data/types'
import { cache } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const createProduct = async (req: {
  title: string
  description: string
  previewUrl: string
  price: string
  discount?: number | null
  status: Product['status']
  categoryIds: number[]
}) => {
  const res = await axios.auth.post<Product>(`${BASE_URL}/product`, req)
  return res.data
}

export const getProduct = cache(async (productId: number) => {
  const res = await axios.auth.get<Product>(`${BASE_URL}/product/${productId}`)
  return res.data
})

export const getProducts = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: ('VISIBLE' | 'INVISIBLE')[]
}) => {
  try {
    const url = new URL(`${BASE_URL}/products`)
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

    const res = await axios.auth.get<Page<Product>>(url.toString())
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getBoughtProducts = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: ('VISIBLE' | 'INVISIBLE')[]
}) => {
  const url = new URL(`${BASE_URL}/user/bought-products`)
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

  const res = await axios.auth.get<Page<Product>>(url.toString())

  return res.data
}

export async function getLikedProducts(req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: ('VISIBLE' | 'INVISIBLE')[]
}) {
  const url = new URL(`${BASE_URL}/user/liked-products`)
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

  const res = await axios.auth.get<Page<Product>>(url.toString())

  return res.data
}

export async function addLike(productId: number) {
  const url = `${BASE_URL}/product/${productId}/like`
  const res = await axios.auth.patch<Product>(url)

  return res.data
}

export async function removeLike(productId: number) {
  const url = `${BASE_URL}/product/${productId}/like`
  const res = await axios.auth.delete<Product>(url)

  return res.data
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
  const url = `${BASE_URL}/product/${productId}`
  const res = await axios.auth.put<Product>(url, req)

  return res.data
}
