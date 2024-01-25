import { Decimal } from 'decimal.js'
import { ShoppingCartIcon, StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter } from '@pengode/common/utils'
import { AspectRatio } from '@pengode/components/ui/aspect-ratio'
import { Badge } from '@pengode/components/ui/badge'
import { Separator } from '@pengode/components/ui/separator'

export type ProductItemProps = PropsWithClassName & {
  id: number
  title: string
  previewUrl: string
  categories: { id: number; name: string }[]
  totalRatings: number
  numberOfRatings: number
  numberOfBuyers: number
  price: string
  discount?: number | null
}

export const ProductItem = ({
  id,
  title,
  previewUrl,
  categories,
  totalRatings,
  numberOfRatings,
  numberOfBuyers,
  price,
  discount,
}: ProductItemProps) => {
  return (
    <Link
      key={id}
      href={`/product/${id}`}
      className={cn(
        'w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-background',
      )}>
      <AspectRatio ratio={3 / 2}>
        <Image
          src={previewUrl}
          width={400}
          height={(3 / 2) * 400}
          alt={title}
          className='h-full w-full object-cover transition-all hover:scale-110'
        />
      </AspectRatio>
      <div className='p-4'>
        <h6 className='truncate text-nowrap text-lg font-semibold'>{title}</h6>
        <div className='mb-4 flex flex-nowrap gap-2'>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant='secondary'
              className='text-[10px]'>
              {category.name}
            </Badge>
          ))}
        </div>
        <Separator className='mb-4' />
        <div className='flex items-center justify-between gap-4'>
          <div className='flex gap-2 text-xs'>
            <div className='flex gap-1 text-muted-foreground'>
              <StarIcon className='h-3 w-3' />
              {totalRatings / numberOfRatings || 0}
            </div>
            <div className='flex gap-1 text-muted-foreground'>
              <ShoppingCartIcon className='h-3 w-3' />
              {numberOfBuyers}
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <div className='text-xs font-semibold'>
              {RupiahFormatter.format(
                new Decimal(price).sub(new Decimal(price).times(discount || 0)),
              )}
            </div>
            {!!discount && (
              <div className='text-[10px]  text-muted-foreground'>
                <span className='me-2 line-through'>
                  {RupiahFormatter.format(price)}
                </span>
                <span className='font-bold text-red-500'>
                  {discount * 100}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
