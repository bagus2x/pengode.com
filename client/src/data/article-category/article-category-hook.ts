import { ArticleCategory } from '@pengode/data/article-category/article-category'
import {
  createArticleCategory,
  deleteCategory,
  getArticleCategories,
  getCategory,
  updateArticleCategory,
} from '@pengode/data/article-category/article-category-api'
import { Page } from '@pengode/data/types'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationKey: useCreateCategoryMutation.key,
    mutationFn: createArticleCategory,
  })
}

useCreateCategoryMutation.key = ['CREATE_ARTICLE_CATEGORY']

export const useGetArticleCategoriesQuery = ({
  size,
  search,
  initialData,
}: {
  size?: number
  search?: string
  initialData?: Page<ArticleCategory>
} = {}) => {
  return useInfiniteQuery({
    queryKey: useGetArticleCategoriesQuery.key(size, search),
    queryFn: async ({ pageParam }) => {
      return await getArticleCategories({
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

useGetArticleCategoriesQuery.key = (size?: number, search?: string) => [
  'GET_INFINITE_ARTICLE_CATEGORIES',
  size,
  search,
]

export const useGetCategoryQuery = (categoryId: number) => {
  return useQuery({
    queryKey: useGetCategoryQuery.key(categoryId),
    queryFn: async () => await getCategory(categoryId),
  })
}

useGetCategoryQuery.key = (categoryId: number) => [
  'GET_ARTICLE_CATEGORY',
  categoryId,
]

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationKey: useUpdateCategoryMutation.key,
    mutationFn: async ({
      categoryId,
      ...req
    }: { categoryId: number } & Parameters<
      typeof updateArticleCategory
    >[1]) => {
      return await updateArticleCategory(categoryId, req)
    },
  })
}

useUpdateCategoryMutation.key = ['UPDATE_ARTICLE_CATEGORY']

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationKey: useDeleteCategoryMutation.key,
    mutationFn: deleteCategory,
  })
}

useDeleteCategoryMutation.key = ['DELETE_ARTICLE_CATEGORY']
