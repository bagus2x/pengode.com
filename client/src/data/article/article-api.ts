import axios from '@pengode/common/axios'
import { Article } from '@pengode/data/article/article'
import { Cursor, Page } from '@pengode/data/types'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const createArticle = async (req: {
  title: string
  thumbnailUrl?: string | null
  body: string
  summary: string
  readingTime?: number | null
  categoryIds: number[]
}) => {
  const url = `${BASE_URL}/article`
  const res = await axios.auth.post<Article>(url, req)

  return res.data
}

export const getArticles = async (req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: Article['status'][]
}) => {
  const url = new URL(`${BASE_URL}/articles`)
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

  const res = await axios.auth.get<Page<Article>>(url.toString())

  return res.data
}

export const getArticle = async (articleId: number) => {
  const url = `${BASE_URL}/article/${articleId}`
  const res = await axios.auth.get<Article>(url)

  return res.data
}

export const updateArticle = async (
  articleId: number,
  req: {
    title: string
    thumbnailUrl?: string | null
    body: string
    summary: string
    categoryIds: number[]
  },
) => {
  const url = `${BASE_URL}/article/${articleId}`
  const res = await axios.auth.put<Article>(url, req)

  return res.data
}

export const draftArticle = async (articleId: number) => {
  const url = `${BASE_URL}/article/${articleId}/draft`
  const res = await axios.auth.patch(url.toString())

  return res.data
}

export const scheduleArticle = async ({
  articleId,
  req,
}: {
  articleId: number
  req: { time: number }
}) => {
  const url = `${BASE_URL}/article/${articleId}/schedule`
  const res = await axios.auth.patch(url.toString(), req)

  return res.data
}

export const publishArticle = async (articleId: number) => {
  const url = `${BASE_URL}/article/${articleId}/publish`
  const res = await axios.auth.patch(url.toString())

  return res.data
}

export const deleteArticle = async ({
  articleId,
  permanent,
}: {
  articleId: number
  permanent: boolean
}) => {
  const url = new URL(`${BASE_URL}/article/${articleId}`)
  if (permanent) url.searchParams.append('permanent', `${permanent}`)

  const res = await axios.auth.delete(url.toString())

  return res.data
}

export const restoreArticle = async (articleId: number) => {
  const url = `${BASE_URL}/article/${articleId}/restore`
  const res = await axios.auth.patch(url.toString())

  return res.data
}
