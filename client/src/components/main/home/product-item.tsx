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
import { Product } from '@pengode/data/product/product'

export type ProductItemProps = PropsWithClassName & {
  product: Product
}

export const ProductItem = ({ className, product }: ProductItemProps) => {
  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-background',
      )}>
      <AspectRatio ratio={3 / 2}>
        <Image
          src={product.previewUrl}
          width={400}
          height={(3 / 2) * 400}
          alt={product.title}
          className='h-full w-full object-cover transition-all hover:scale-110'
        />
      </AspectRatio>
      <div className='p-4'>
        <h6 className='truncate text-nowrap text-lg font-semibold'>
          {product.title}
        </h6>
        <div className='mb-4 flex flex-nowrap gap-2'>
          {product.categories.map((category) => (
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
              {(product.numberOfOneStars * 1 +
                product.numberOfTwoStars * 2 +
                product.numberOfThreeStars * 3 +
                product.numberOfFourStars * 4 +
                product.numberOfFiveStars * 5) /
                (product.numberOfOneStars +
                  product.numberOfTwoStars +
                  product.numberOfThreeStars +
                  product.numberOfFourStars +
                  product.numberOfFiveStars) || 0}
            </div>
            <div className='flex gap-1 text-muted-foreground'>
              <ShoppingCartIcon className='h-3 w-3' />
              {product.numberOfBuyers}
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <div className='text-xs font-semibold'>
              {RupiahFormatter.format(
                new Decimal(product.price).sub(
                  new Decimal(product.price).times(product.discount || 0),
                ),
              )}
            </div>
            {!!product.discount && (
              <div className='text-[10px]  text-muted-foreground'>
                <span className='me-2 line-through'>
                  {RupiahFormatter.format(product.price)}
                </span>
                <span className='font-bold text-red-500'>
                  {product.discount * 100}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
