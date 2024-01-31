import {
  createProductCategory,
  getProductCategories,
} from '@pengode/data/product-category/product-category-api'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'

export const useCreateProductCategoryMutation = () => {
  return useMutation({
    mutationKey: useCreateProductCategoryMutation.key,
    mutationFn: createProductCategory,
  })
}

useCreateProductCategoryMutation.key = ['CREATE_PRODUCT_CATEGORY']

export const useGetProductCategoriesQuery = ({
  search,
}: {
  search?: string
}) => {
  return useInfiniteQuery({
    queryKey: useGetProductCategoriesQuery.key(search),
    queryFn: async ({ pageParam }) =>
      await getProductCategories({ cursor: { nextCursor: pageParam }, search }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
  })
}

useGetProductCategoriesQuery.key = (search?: string) => [
  'GET_INFINITE_PRODUCT_CATEGORIES',
  search,
]
