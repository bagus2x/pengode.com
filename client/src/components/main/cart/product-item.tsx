import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter } from '@pengode/common/utils'
import { Checkbox } from '@pengode/components/ui/checkbox'
import { Product } from '@pengode/data/product'
import Decimal from 'decimal.js'
import Image from 'next/image'

export type ProductItemProps = PropsWithClassName & {
  product: Product
  selected: boolean
  onSelect: (selected: boolean) => void
}

export const ProductItem = ({
  className,
  product,
  selected,
  onSelect,
}: ProductItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-4 border-b border-border p-4',
        className,
      )}>
      <Checkbox checked={selected} onCheckedChange={onSelect} />
      <Image
        src={product.previewUrl}
        width={120}
        height={120}
        alt={product.title}
        className='h-16 w-16 rounded-lg'
      />
      <h6 className='line-clamp-2 flex-1 scroll-m-20 text-base font-semibold tracking-tight'>
        {product.title}
      </h6>
      <div className='flex flex-col items-end text-xs'>
        <span className='font-semibold'>
          {RupiahFormatter.format(
            new Decimal(product.price).sub(
              new Decimal(product.price).times(product.discount || 0),
            ),
          )}
        </span>
        <div>
          <span className='text-muted-foreground line-through'>
            {RupiahFormatter.format(new Decimal(product.price))}
          </span>
          {!!product.discount && (
            <span className='ms-2 font-semibold text-red-500'>
              {product.discount * 100}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
