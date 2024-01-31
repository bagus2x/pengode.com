'use server'

export interface ArticleCategory {
  id: number
  name: string
  color?: string | null
  updatedAt: string
  createdAt: string
}
