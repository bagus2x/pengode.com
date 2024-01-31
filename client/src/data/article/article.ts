'use server'

export interface Article {
  id: number
  author: {
    name: string
    photo: string
  }
  title: string
  thumbnail?: string | null
  body: string
  summary: string
  readingTime?: number | null
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'DELETED'
  categories: { id: number; name: string }[]
  createdAt: string
  updatedAt: string
}
