'use server'

import { get, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'

export interface ArticleStatus {
  id: number
  name: string
  updatedAt: string
  createdAt: string
}

export async function getStatuses() {
  return await withAuth(get)<ArticleStatus[]>({
    url: `${env('PENGODE_API_BASE_URL')}/article-statuses`,
  })
}
