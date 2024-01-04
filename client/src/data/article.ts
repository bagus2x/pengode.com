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
import { Page } from '@pengode/data/types'

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
  status: {
    id: string
    name: string
  }
  categories: { id: number; name: string }[]
  createdAt: string
  updatedAt: string
}

export async function createArticle(req: {
  title: string
  thumbnail?: string | null
  body: string
  summary: string
  readingTime?: number | null,
  categoryIds: number[]
}) {
  return await withAuth(post)<Article>({
    url: `${env('PENGODE_API_BASE_URL')}/article`,
    body: req,
  })
}

export async function getArticles(req?: {
  page?: number
  size?: number
  search?: string
  statusIds?: number[]
}) {
  const url = new URL(`${env('PENGODE_API_BASE_URL')}/articles`)
  if (req?.page) url.searchParams.append('page', `${req.page}`)
  if (req?.size) url.searchParams.append('size', `${req.size}`)
  url.searchParams.append('order.id', 'desc')
  if (req?.search) url.searchParams.append('search', req.search)
  if (req?.statusIds) {
    req?.statusIds.forEach((statusId) => {
      url.searchParams.append('status_id', `${statusId}`)
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
