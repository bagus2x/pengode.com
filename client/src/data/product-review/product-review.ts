'use server'

import { Product } from '@pengode/data/product/product'
import { User } from '@pengode/data/user/user'

export interface ProductReview {
  id: number
  reviewer: User
  product: Product
  description: string
  star: number
  createdAt: Date
  updatedAt: Date
}
