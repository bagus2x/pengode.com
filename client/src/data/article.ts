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

export type Status = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'DELETED'

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
  status: Status
  categories: { id: number; name: string }[]
  createdAt: string
  updatedAt: string
}

export async function createArticle(req: {
  title: string
  thumbnail?: string | null
  body: string
  summary: string
  readingTime?: number | null
  categoryIds: number[]
}) {
  return await withAuth(post)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article`,
    body: req,
  })
}

export async function getArticles(req?: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: Status[]
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/articles`)
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

  return await withAuth(get)<Page<Article>>({ url })
}

export async function getArticle(articleId: number) {
  return await withAuth(get)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article/${articleId}`,
  })
}

export async function updateArticle(
  articleId: number,
  req: {
    title: string
    thumbnail?: string | null
    body: string
    summary: string
    categoryIds: number[]
  },
) {
  return await withAuth(put)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article/${articleId}`,
    body: req,
  })
}

export async function draftArticle(articleId: number) {
  return await withAuth(patch)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article/${articleId}/draft`,
  })
}

export async function scheduleArticle({
  articleId,
  req,
}: {
  articleId: number
  req: { time: number }
}) {
  return await withAuth(patch)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article/${articleId}/schedule`,
    body: req,
  })
}

export async function publishArticle(articleId: number) {
  return await withAuth(patch)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article/${articleId}/publish`,
  })
}

export async function deleteArticle({
  articleId,
  permanent,
}: {
  articleId: number
  permanent: boolean
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/article/${articleId}`)
  if (permanent) url.searchParams.append('permanent', `${permanent}`)
  return await withAuth(del)<Article>({ url })
}

export async function restoreArticle(articleId: number) {
  return await withAuth(patch)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article/${articleId}/restore`,
  })
}
