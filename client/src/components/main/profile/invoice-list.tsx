'use client'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { InvoiceItem } from '@pengode/components/main/profile/invoice-item'
import { useGetInvoicesByAuthUserQuery } from '@pengode/data/product-invoice/product-invoice-hook'

export type ProductInvoiceListProps = PropsWithClassName & {}

export const ProductInvoiceList = ({ className }: ProductInvoiceListProps) => {
  const { data: invoicePages } = useGetInvoicesByAuthUserQuery({})

  return (
    <div className={cn('flex flex-col gap-4 py-1', className)}>
      <h6 className='text-lg font-semibold'>Invoices 📃</h6>
      {invoicePages?.pages.map((page) =>
        page.items.map((invoice) => (
          <InvoiceItem key={invoice.id} invoice={invoice} className='w-full' />
        )),
      )}
    </div>
  )
}
