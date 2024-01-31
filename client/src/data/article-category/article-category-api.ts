import axios from '@pengode/common/axios'
import { env } from '@pengode/common/utils'
import { ArticleCategory } from '@pengode/data/article-category/article-category'
import { Cursor, Page } from '@pengode/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const createArticleCategory = async (req: {
  name: string
  color?: string | null
}) => {
  const url = `${BASE_URL}/article-category`
  const res = await axios.auth.post<ArticleCategory>(url, req)
  return res.data
}

export const getArticleCategories = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
}) => {
  const url = new URL(`${BASE_URL}/article-categories`)
  if (req?.cursor?.nextCursor)
    url.searchParams.append('nextCursor', `${req.cursor?.nextCursor}`)
  if (req?.cursor?.previousCursor)
    url.searchParams.append('previousCursor', `${req.cursor?.previousCursor}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  if (req?.search) url.searchParams.append('search', req.search)

  const res = await axios.auth.get<Page<ArticleCategory>>(url.toString())
  return res.data
}

export const getCategory = async (articleId: number) => {
  const url = `${BASE_URL}/article-category/${articleId}`
  const res = await axios.auth.get<ArticleCategory>(url)
  return res.data
}

export const updateArticleCategory = async (
  categoryId: number,
  req: {
    title: string
    thumbnail?: string
    body: string
    summary: string
  },
) => {
  const url = `${BASE_URL}/article-category/${categoryId}`
  const res = await axios.auth.put<ArticleCategory>(url, req)
  return res.data
}

export const deleteCategory = async (articleId: number) => {
  const url = `${BASE_URL}/article-category/${articleId}`
  const res = await axios.auth.delete<ArticleCategory>(url)
  return res.data
}
