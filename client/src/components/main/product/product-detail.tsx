'use client'

import { useMutation } from '@tanstack/react-query'
import Decimal from 'decimal.js'
import { HeartIcon, Loader2Icon, Share2Icon, StarIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { toast } from 'sonner'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter } from '@pengode/common/utils'
import { AspectRatio } from '@pengode/components/ui/aspect-ratio'
import { Button } from '@pengode/components/ui/button'
import { Input } from '@pengode/components/ui/input'
import { Separator } from '@pengode/components/ui/separator'
import { Product } from '@pengode/data/product'
import { createInvoice } from '@pengode/data/product-invoice'
import { Progress } from '@pengode/components/ui/progress'

export type ProductDetailProps = PropsWithClassName &
  PropsWithChildren & {
    product: Product
  }

export const ProductDetail = ({
  className,
  children,
  product,
}: ProductDetailProps) => {
  const router = useRouter()
  const createInvoiceMutation = useMutation({ mutationFn: createInvoice })

  const handleCreateInvoice = () => {
    createInvoiceMutation.mutate(
      { productIds: [product.id] },
      {
        onSuccess: async (invoice) => {
          router.push(`/invoice/${invoice.id}`)
          toast.success('Invoice created')
        },
        onError: (err) => {
          err.message.split(', ').forEach((message) => {
            toast.error(message)
          })
        },
      },
    )
  }

  return (
    <section
      className={cn(
        'mx-auto flex max-w-screen-xl flex-col items-start gap-4 sm:flex-row',
        className,
      )}>
      <div className='flex w-full min-w-0 flex-1 flex-col gap-4'>
        <AspectRatio
          ratio={3 / 2}
          className='h-full w-full overflow-hidden rounded-2xl'>
          <Image
            src={product.previewUrl}
            width={800}
            height={(3 / 2) * 800}
            alt={product.title}
            className='h-full w-full object-cover'
          />
        </AspectRatio>
        <div className='min-w-0 max-w-full flex-1 rounded-2xl border border-border bg-background p-4'>
          <h1 className='mb-4 scroll-m-20 text-2xl font-semibold tracking-tight'>
            {product.title}
          </h1>
          <div className='prose prose-slate w-full max-w-full [&>p]:break-words'>
            {children}
          </div>
        </div>
      </div>
      <div className='w-full min-w-64 sm:max-w-xs'>
        <div className='mb-4 rounded-2xl border border-border bg-background p-4'>
          <div className='mb-4'>
            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
              {RupiahFormatter.format(
                new Decimal(product.price).sub(
                  new Decimal(product.price).times(product.discount || 0),
                ),
              )}
            </h3>
            {product.discount && (
              <div className='text-xs'>
                <span className='me-2 text-muted-foreground line-through'>
                  {RupiahFormatter.format(new Decimal(product.price))}
                </span>
                <span className='font-bold text-red-500'>
                  {product.discount * 100}%
                </span>
              </div>
            )}
          </div>
          <Input readOnly placeholder='Coupon' className='mb-4' />
          <Button
            className='w-full'
            onClick={handleCreateInvoice}
            disabled={createInvoiceMutation.isPending}>
            {createInvoiceMutation.isPending && (
              <Loader2Icon size={16} className='me-2 animate-spin' />
            )}
            Buy
          </Button>
          <Separator className='mb-4' />
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' className='mb-4 w-full'>
              + Add to cart
            </Button>
            <Button variant='outline' size='circle-sm' className='shrink-0'>
              <HeartIcon className='h-4 w-4 text-muted-foreground' />
            </Button>
            <Button variant='outline' size='circle-sm' className='shrink-0'>
              <Share2Icon className='h-4 w-4 text-muted-foreground' />
            </Button>
          </div>
        </div>
        <div className='flex flex-col gap-3 rounded-2xl border border-border bg-background p-4'>
          <h4 className='mb-2 scroll-m-20 text-xl font-semibold tracking-tight'>
            Rating
          </h4>
          <div className='flex items-center justify-center'>
            <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
              ⭐&nbsp;4.8&nbsp;
            </h2>
            <h6 className='text-sm text-muted-foreground'>/&nbsp;5.0</h6>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <StarIcon className='h-4 w-4 text-yellow-500' />
            <Progress value={70} className='h-2' />
            <span>70</span>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <StarIcon className='h-4 w-4 text-yellow-500' />
            <Progress value={20} className='h-2' />
            <span>20</span>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <StarIcon className='h-4 w-4 text-yellow-500' />
            <Progress value={5} className='h-2' />
            <span>5</span>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <StarIcon className='h-4 w-4 text-yellow-500' />
            <Progress value={3} className='h-2' />
            <span>3</span>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <StarIcon className='h-4 w-4 text-yellow-500' />
            <Progress value={2} className='h-2' />
            <span>2</span>
          </div>
        </div>
      </div>
    </section>
  )
}
