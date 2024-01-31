'use client'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ProductItem } from '@pengode/components/main/profile/product-item'
import { useGetLikedProductsQuery } from '@pengode/data/product/product-hook'

export type LikedProductListProps = PropsWithClassName & {}

export const LikedProductList = ({ className }: LikedProductListProps) => {
  const { data: productPages } = useGetLikedProductsQuery()

  return (
    <div className={cn('flex flex-col gap-4 py-1', className)}>
      <h6 className='text-lg font-semibold'>Liked Products 💖</h6>
      {productPages?.pages.map((page) =>
        page.items.map((product, index) => (
          <ProductItem key={index} product={product} className='w-full' />
        )),
      )}
    </div>
  )
}
