import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter } from '@pengode/common/utils'
import { Badge } from '@pengode/components/ui/badge'
import { ProductInvoice } from '@pengode/data/product-invoice/product-invoice'
import Image from 'next/image'
import Link from 'next/link'

export type InvoiceItemProps = PropsWithClassName & {
  invoice: ProductInvoice
}

export const InvoiceItem = ({ className, invoice }: InvoiceItemProps) => {
  return (
    <Link
      href={`/invoice/${invoice.id}`}
      className={cn(
        'flex cursor-pointer gap-4 rounded-2xl transition-all hover:bg-secondary',
        className,
      )}>
      <Image
        src={invoice.items[0].product.previewUrl}
        alt={invoice.items[0].product.title}
        width={120}
        height={120}
        className='h-16 w-16 rounded-xl'
      />
      <div className='flex flex-col justify-center'>
        <div className='line-clamp-2 font-semibold'>
          {invoice.items.map(({ product }) => product.title).join(', ')}
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Badge
            variant='secondary'
            className={cn(
              (invoice.status === 'PENDING' ||
                invoice.status === 'PENDING_PAYMENT') &&
                'bg-orange-200 text-orange-500 hover:bg-orange-200 hover:text-orange-500',
              invoice.status === 'PAID' &&
                'bg-green-200 text-green-500 hover:bg-green-200 hover:text-green-500',
              invoice.status === 'CANCELED' &&
                'bg-red-200 text-red-500 hover:bg-red-200 hover:text-red-500',
            )}>
            {invoice.status}
          </Badge>
          <span>{RupiahFormatter.format(invoice.grossAmount)}</span>
        </div>
      </div>
    </Link>
  )
}
