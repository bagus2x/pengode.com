import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import {
  createProductReview,
  getProductReviewByAuthUserAndProduct,
  getProductReviewsByAuthUser,
} from '@pengode/data/product-review/product-review-api'

export const useCreateProductReviewMutationQuery = () => {
  return useMutation({
    mutationKey: useCreateProductReviewMutationQuery.key,
    mutationFn: createProductReview,
  })
}

useCreateProductReviewMutationQuery.key = ['CREATE_PRODUCT_REVIEW']

export const useGetProductReviewByAuthUserAndProductQuery = ({
  productId,
}: {
  productId: number
}) => {
  const session = useSession()

  return useQuery({
    queryKey: useGetProductReviewByAuthUserAndProductQuery.key(productId),
    queryFn: async () => await getProductReviewByAuthUserAndProduct(productId),
    enabled: session.status === 'authenticated',
  })
}

useGetProductReviewByAuthUserAndProductQuery.key = (productId: number) => [
  'GET_PRODUCT_REVIEW_BY_AUTH_USER_AND_PRODUCT',
  productId,
]

export const useGetProductReviewsByAuthUserQuery = () => {
  return useInfiniteQuery({
    queryKey: useGetProductReviewsByAuthUserQuery.key,
    queryFn: async ({ pageParam }) =>
      await getProductReviewsByAuthUser({ cursor: { nextCursor: pageParam } }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
  })
}

useGetProductReviewsByAuthUserQuery.key = [
  'GET_INFINITE_PRODUCT_REVIEWS_BY_AUTH_USER',
]
