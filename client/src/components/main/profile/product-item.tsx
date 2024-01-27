import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { avatar } from '@pengode/common/utils'
import { Product } from '@pengode/data/product'

export type ProductItemProps = PropsWithClassName & {
  product: Product
}

export const ProductItem = ({ className, product }: ProductItemProps) => {
  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'flex cursor-pointer gap-4 rounded-2xl transition-all hover:bg-secondary',
        className,
      )}>
      <Image
        src={product.previewUrl}
        alt={product.title}
        width={120}
        height={120}
        className='h-16 w-16 rounded-xl'
      />
      <div className='flex flex-col justify-center'>
        <div className='font-semibold'>{product.title}</div>
        <div className='flex items-center text-sm text-muted-foreground'>
          <Image
            src={avatar(product.owner.username, product.owner.photo)}
            width={16}
            height={16}
            alt={product.title}
            className='me-1 rounded-full'
          />
          <span>{product.owner.name}</span>
        </div>
      </div>
    </Link>
  )
}
