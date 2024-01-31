import { Article } from '@pengode/data/article/article'
import {
  createArticle,
  deleteArticle,
  draftArticle,
  getArticle,
  getArticles,
  publishArticle,
  restoreArticle,
  scheduleArticle,
  updateArticle,
} from '@pengode/data/article/article-api'
import { upload } from '@pengode/data/cloudinary/cloudinary-api'
import { Cursor, Page } from '@pengode/data/types'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const useCreateArticleMutation = () => {
  return useMutation({
    mutationKey: useCreateArticleMutation.key,
    mutationFn: createArticle,
  })
}

useCreateArticleMutation.key = ['CREATE_ARTICLE']

export const useGetArticlesQuery = ({
  size,
  search,
  initialData,
}: {
  search?: string
  size?: number
  initialData?: Page<Article>
}) => {
  return useInfiniteQuery({
    queryKey: useGetArticlesQuery.key({ size, search }),
    queryFn: async ({ pageParam }) => {
      return await getArticles({
        cursor: { nextCursor: pageParam },
        size,
        search,
      })
    },
    initialPageParam: Math.pow(2, 31) - 1,
    initialData: initialData
      ? () => {
          return {
            pageParams: [undefined],
            pages: [initialData],
          }
        }
      : undefined,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
  })
}

useGetArticlesQuery.key = ({
  cursor,
  size,
  search,
  statuses,
}: {
  cursor?: Cursor
  size?: number
  search?: string
  statuses?: Article['status'][]
}) => ['GET_INFINITE_ARTICLES', cursor, size, search, statuses]

export const useGetArticleQuery = ({ articleId }: { articleId?: number }) => {
  return useQuery({
    queryKey: useGetArticleQuery.key(articleId),
    queryFn: async () => await getArticle(articleId!!),
    enabled: !!articleId,
  })
}

useGetArticleQuery.key = (articleId?: number) => ['GET_ARTICLE', articleId]

export const useUpdateArticleMutation = () => {
  return useMutation<
    Article,
    Error,
    { articleId: number } & Parameters<typeof updateArticle>[1]
  >({
    mutationKey: useUpdateArticleMutation.key,
    mutationFn: async ({ articleId, ...req }) =>
      await updateArticle(articleId, req),
  })
}

useUpdateArticleMutation.key = ['UPDATE_ARTICLE']

export const useDraftArticleMutation = () => {
  return useMutation({
    mutationKey: useDraftArticleMutation.key,
    mutationFn: draftArticle,
  })
}

useDraftArticleMutation.key = ['DRAFT_ARTICLE']

export const useScheduleArticleMutation = () => {
  return useMutation({
    mutationKey: useScheduleArticleMutation.key,
    mutationFn: scheduleArticle,
  })
}

useScheduleArticleMutation.key = ['SCHEDULE_ARTICLE']

export const usePublishArticleMutation = () => {
  return useMutation({
    mutationKey: usePublishArticleMutation.key,
    mutationFn: publishArticle,
  })
}

usePublishArticleMutation.key = ['PUBLISH_ARTICLE']

export const useDeleteArticleMutation = () => {
  return useMutation({
    mutationKey: useDeleteArticleMutation.key,
    mutationFn: deleteArticle,
  })
}

useDeleteArticleMutation.key = ['DELETE_ARTICLE']

export const useRestoreArticleMutation = () => {
  return useMutation({
    mutationKey: useRestoreArticleMutation.key,
    mutationFn: restoreArticle,
  })
}

useRestoreArticleMutation.key = ['RESTORE_ARTICLE']

export const useUpsertArticleMutation = ({
  articleId,
}: {
  articleId?: number
}) => {
  const isEditing = !!articleId

  const getThumbnailUrl = async (thumbnail: (File | string) | null) => {
    if (thumbnail instanceof File) {
      // Assuming there's an 'upload' function for handling file uploads
      const formData = new FormData()
      formData.append('file', thumbnail)
      const res = await upload(formData)

      return res['secure_url']
    }

    return thumbnail
  }

  return useMutation({
    mutationKey: useUpsertArticleMutation.key,
    mutationFn: async ({
      thumbnail,
      ...req
    }: Omit<Parameters<typeof createArticle>[0], 'thumbnailUrl'> & {
      thumbnail: (string | File) & (string | File | undefined)
    }) => {
      const thumbnailUrl = await getThumbnailUrl(thumbnail)

      if (isEditing) {
        return await updateArticle(articleId, { thumbnailUrl, ...req })
      }

      return await createArticle({ thumbnailUrl, ...req })
    },
  })
}

useUpsertArticleMutation.key = ['UPSERT_ARTICLE']
