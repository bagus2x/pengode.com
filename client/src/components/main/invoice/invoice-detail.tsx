'use client'

import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { CopyIcon } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter, avatar } from '@pengode/common/utils'
import { PaymentCounter } from '@pengode/components/main/invoice/payment-counter'
import { PaymentDrawer } from '@pengode/components/main/invoice/payment-drawer'
import { Badge } from '@pengode/components/ui/badge'
import { Button } from '@pengode/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@pengode/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@pengode/components/ui/table'
import { ProductInvoice } from '@pengode/data/product-invoice/product-invoice'
import { useGetInvoiceQuery } from '@pengode/data/product-invoice/product-invoice-hook'

export type InvoiceInfoProps = PropsWithClassName & {
  invoice: ProductInvoice
}

export const InvoiceDetail = ({
  className,
  invoice: initialInvoice,
}: InvoiceInfoProps) => {
  const { data: invoice } = useGetInvoiceQuery({
    invoiceId: initialInvoice.id,
    initialData: initialInvoice,
  })

  if (!invoice) {
    notFound()
  }

  return (
    <section
      className={cn(
        'mx-auto flex max-w-screen-xl flex-col items-start gap-4 lg:flex-row',
        className,
      )}>
      <Card>
        <CardHeader className='flex-row items-start justify-between gap-4'>
          <div>
            <CardTitle>Invoice</CardTitle>
            <CardDescription>
              An invoice is a commercial document that itemizes and records a
              transaction between a buyer and a seller
            </CardDescription>
          </div>
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
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex gap-4'>
            <div className='flex flex-col gap-2'>
              <h4 className='scroll-m-20 text-lg font-semibold tracking-tight'>
                ID
              </h4>
              <div className='flex text-sm text-muted-foreground'>
                <button className='me-2'>
                  <CopyIcon className='h-4 w-4' />
                </button>
                <span className='block max-w-40 truncate'>{invoice.token}</span>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <h4 className='scroll-m-20 text-lg font-semibold tracking-tight'>
                Date
              </h4>
              <div className='text-sm text-muted-foreground'>
                {dayjs(invoice.createdAt).format('DD/MM/YYYY hh:mm:ss')}
              </div>
            </div>
            {(invoice.status === 'PENDING_PAYMENT' ||
              invoice.status === 'PENDING') && (
              <div className='flex flex-col gap-2'>
                <h4 className='scroll-m-20 text-lg font-semibold tracking-tight'>
                  Pay Before
                </h4>
                <PaymentCounter
                  createdAt={invoice.createdAt}
                  className='text-sm text-orange-500'
                />
              </div>
            )}
          </div>
        </CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='ps-6'>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className='text-right'>Discount</TableHead>
              <TableHead className='pe-6 text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='ps-6'>{item.product.title}</TableCell>
                <TableCell>{RupiahFormatter.format(item.price)}</TableCell>
                <TableCell className='text-right'>
                  {item.discount ? item.discount * 100 : 0}%
                </TableCell>
                <TableCell className='pe-6 text-right'>
                  {RupiahFormatter.format(
                    new Decimal(item.price).sub(
                      new Decimal(item.price).times(item.discount || 0),
                    ),
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className='text-right'>
                Total
              </TableCell>
              <TableCell className='pe-6 text-right'>
                {RupiahFormatter.format(invoice.grossAmount)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
      <div className='w-full min-w-60 lg:max-w-96'>
        <Card className='mb-4 w-full'>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex'>
              <Image
                src={avatar(invoice.customer.username, invoice.customer.photo)}
                width={40}
                height={40}
                alt={invoice.customer.name}
                className='me-4 h-10 w-10 shrink-0 rounded-full'
              />
              <div className='text-sm'>
                <p className='font-semibold'>{invoice.customer.name}</p>
                <p className='text-muted-foreground'>
                  {invoice.customer.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {invoice.status !== 'PAID' && (
          <PaymentDrawer
            snapToken={invoice.token}
            renderButton={<Button className='w-full'>Pay</Button>}
            onSuccess={() => {
              toast.success('Payment completed')
            }}
            onPending={() => {}}
            onClose={() => {}}
          />
        )}
      </div>
    </section>
  )
}
