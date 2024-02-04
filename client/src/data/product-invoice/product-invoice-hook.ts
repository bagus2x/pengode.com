import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

import {
  createInvoice,
  getInvoice,
  getInvoicesByAuthUser,
} from '@pengode/data/product-invoice/product-invoice-api'
import { ProductInvoice } from '@pengode/data/product-invoice/product-invoice'
import { Page } from '@pengode/data/types'

export const useCreateInvoiceMutation = () => {
  return useMutation({
    mutationKey: useCreateInvoiceMutation.key,
    mutationFn: createInvoice,
  })
}

useCreateInvoiceMutation.key = ['CREATE_INVOICE']

export const useGetInvoiceQuery = ({
  invoiceId,
  initialData,
}: {
  invoiceId: number
  initialData?: ProductInvoice
}) => {
  return useQuery({
    queryKey: useGetInvoiceQuery.key(invoiceId),
    queryFn: async () => await getInvoice(invoiceId),
    initialData: initialData,
  })
}

useGetInvoiceQuery.key = (invoiceId: number) => ['GET_INVOICE', invoiceId]

export const useGetInvoicesByAuthUserQuery = ({
  size,
  search,
  initialData,
}: {
  search?: string
  size?: number
  initialData?: Page<ProductInvoice>
}) => {
  return useInfiniteQuery({
    queryKey: useGetInvoicesByAuthUserQuery.key(size, search),
    queryFn: async ({ pageParam }) => {
      return await getInvoicesByAuthUser({
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

useGetInvoicesByAuthUserQuery.key = (size?: number, search?: string) => [
  'GET_INFINITE_PRODUCT_INVOICE_BY_AUTH_USER',
  size,
  search,
]
