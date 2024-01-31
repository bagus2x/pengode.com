import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { upload } from '@pengode/data/cloudinary/cloudinary-api'
import { Product } from '@pengode/data/product/product'
import {
  addLike,
  createProduct,
  getBoughtProducts,
  getLikedProducts,
  getProduct,
  getProducts,
  removeLike,
  updateProduct,
} from '@pengode/data/product/product-api'
import { Page, RestError } from '@pengode/data/types'

export const useCreateProductMutation = () => {
  return useMutation({
    mutationKey: useCreateProductMutation.key,
    mutationFn: createProduct,
  })
}

useCreateProductMutation.key = ['CREATE_PRODUCT']

export const useGetProductsQuery = ({
  size,
  search,
  initialData,
}: {
  search?: string
  size?: number
  initialData?: Page<Product>
}) => {
  return useInfiniteQuery({
    queryKey: useGetProductsQuery.key(size, search),
    queryFn: async ({ pageParam }) => {
      return await getProducts({
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

useGetProductsQuery.key = (size?: number, search?: string) => [
  'GET_INFINITE_PRODUCTS',
  size,
  search,
]

export const useGetBoughtProductsQuery = () => {
  return useInfiniteQuery({
    queryKey: useGetBoughtProductsQuery.key,
    queryFn: async ({ pageParam }) => {
      return await getBoughtProducts({ cursor: { nextCursor: pageParam } })
    },
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
  })
}

useGetBoughtProductsQuery.key = ['GET_INFINITE_BOUGHT_PRODUCTS']

export const useGetLikedProductsQuery = () => {
  return useInfiniteQuery({
    queryKey: useGetLikedProductsQuery.key,
    queryFn: async ({ pageParam }) => {
      return await getLikedProducts({ cursor: { nextCursor: pageParam } })
    },
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
  })
}

useGetLikedProductsQuery.key = ['GET_INFINITE_LIKED_PRODUCTS']

export const useGetProductQuery = ({
  productId,
  initialData,
}: {
  productId?: number
  initialData?: Product
}) => {
  return useQuery({
    queryKey: useGetProductQuery.key(productId),
    queryFn: async () => getProduct(productId!!),
    initialData,
    enabled: !!productId,
  })
}

useGetProductQuery.key = (productId?: number) => ['GET_PRODUCT', productId]

export const useToggleLikeProductMutation = ({
  productId,
}: {
  productId: number
}) => {
  const { data: product } = useGetProductQuery({ productId })

  return useMutation<Product, AxiosError<RestError>, number>({
    mutationKey: useCreateProductMutation.key,
    mutationFn: (productId) => {
      if (product?.liked) return removeLike(productId)
      else return addLike(productId)
    },
  })
}

export const useUpdateProductMutation = () => {
  return useMutation<
    Product,
    AxiosError<RestError>,
    { productId: number } & Parameters<typeof updateProduct>[1]
  >({
    mutationKey: useUpdateProductMutation.key,
    mutationFn: async ({ productId, ...req }) => updateProduct(productId, req),
  })
}

useUpdateProductMutation.key = ['UPDATE_PRODUCT']

export const useUpsertProductMutation = ({
  productId,
}: {
  productId?: number
}) => {
  const isEditing = !!productId
  const getPreviewUrl = async (preview: File | string) => {
    if (preview instanceof File) {
      const formData = new FormData()
      formData.append('file', preview)
      const res = await upload(formData)

      return res['secure_url']
    }

    return preview
  }

  return useMutation({
    mutationKey: useUpsertProductMutation.key,
    mutationFn: async ({
      preview,
      ...req
    }: Omit<Parameters<typeof createProduct>[0], 'previewUrl'> & {
      preview: File | string
    }) => {
      const previewUrl = await getPreviewUrl(preview)
      if (isEditing) {
        return await updateProduct(productId, { previewUrl, ...req })
      }

      return await createProduct({ previewUrl, ...req })
    },
  })
}

useUpsertProductMutation.key = ['UPSERT_PRODUCT']
