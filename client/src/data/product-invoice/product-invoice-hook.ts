import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createInvoice,
  getInvoice,
} from '@pengode/data/product-invoice/product-invoice-api'
import { ProductInvoice } from '@pengode/data/product-invoice/product-invoice'

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
