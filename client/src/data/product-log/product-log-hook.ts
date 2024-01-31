import {
  createProductLog,
  getProductLogs,
} from '@pengode/data/product-log/product-log-api'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'

export const useCreateProductLogMutation = () => {
  return useMutation({
    mutationKey: useCreateProductLogMutation.key,
    mutationFn: createProductLog,
  })
}

useCreateProductLogMutation.key = ['CREATE_PRODUCT_LOG']

export const useGetProductLogsQuery = () => {
  return useInfiniteQuery({
    queryKey: useGetProductLogsQuery.key,
    queryFn: async ({ pageParam }) =>
      await getProductLogs({ cursor: { nextCursor: pageParam } }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
  })
}

useGetProductLogsQuery.key = ['GET_PRODUCT_LOGS']
