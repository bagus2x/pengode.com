'use server'

export interface ProductLog {
  id: number
  name: string
  productUrl: string
  description: string
  product: {
    id: number
    title: string
    previewUrl: string
    price: string
    discount?: number | null
  }
  createdAt: string
  updatedAt: string
}
