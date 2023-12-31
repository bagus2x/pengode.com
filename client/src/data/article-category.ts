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

export interface ArticleCategory {
  id: number
  name: string
  color?: string | null
  updatedAt: string
  createdAt: string
}

export async function createCategory(req: {
  name: string
  color?: string | null
}) {
  return await withAuth(post)<ArticleCategory>({
    url: `${env('PENGODE_API_BASE_URL')}/article-category`,
    body: req,
  })
}

export async function getCategories() {
  return await withAuth(get)<ArticleCategory[]>({
    url: `${env('PENGODE_API_BASE_URL')}/article-categories`,
  })
}

export async function getCategory(articleId: number) {
  return await get<ArticleCategory>({
    url: `${env('PENGODE_API_BASE_URL')}/article-category/${articleId}`,
  })
}

export async function updateCategory(
  articleId: number,
  req: {
    title: string
    thumbnail?: string
    body: string
    summary: string
  },
) {
  return await withAuth(put)<ArticleCategory>({
    url: `${env('PENGODE_API_BASE_URL')}/article-category/${articleId}`,
    body: req,
  })
}

export async function deleteCategory(articleId: number) {
  return await withAuth(del)<ArticleCategory>({
    url: `${env('PENGODE_API_BASE_URL')}/article-category/${articleId}`,
  })
}
