import { useInfiniteQuery, useMutation } from '@tanstack/react-query'

import {
  addProduct,
  getProducts,
  removeProduct,
} from '@pengode/data/product-cart/product-cart-api'
import { Product } from '@pengode/data/product/product'
import { Page } from '@pengode/data/types'
import { useSession } from 'next-auth/react'

export const useAddProductToCartMutation = () => {
  return useMutation({
    mutationKey: useAddProductToCartMutation.key,
    mutationFn: addProduct,
  })
}

useAddProductToCartMutation.key = ['ADD_PRODUCT_TO_CART']

export const useGetCartProductsQuery = ({
  initialData,
}: {
  initialData?: Page<Product>
}) => {
  const session = useSession()
  return useInfiniteQuery({
    queryKey: useGetCartProductsQuery.key,
    queryFn: async ({ pageParam }) =>
      await getProducts({ cursor: { nextCursor: pageParam } }),
    initialData: initialData
      ? () => {
          return {
            pageParams: [undefined],
            pages: [initialData],
          }
        }
      : undefined,
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) =>
      lastPage.items.length ? lastPage.nextCursor : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.items.length ? firstPage.previousCursor : undefined,
    enabled: session.status === 'authenticated',
  })
}

useGetCartProductsQuery.key = ['GET_INFINITE_CART_PRODUCTS']

export const useRemoveProductFromCartMutation = () => {
  return useMutation<Product[], Error, number[]>({
    mutationKey: useRemoveProductFromCartMutation.key,
    mutationFn: async (productIds) =>
      await Promise.all(
        productIds.map((productId) => removeProduct(productId)),
      ),
  })
}

useRemoveProductFromCartMutation.key = ['REMOVE_PRODUCTS_FROM_CART']
