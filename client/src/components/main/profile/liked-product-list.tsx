'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ProductItem } from '@pengode/components/main/profile/product-item'
import { getLikedProducts } from '@pengode/data/product'

export type LikedProductListProps = PropsWithClassName & {}

export const LikedProductList = ({ className }: LikedProductListProps) => {
  const { data: productPages } = useInfiniteQuery({
    queryKey: ['GET_INFINITE_LIKED_PRODUCTS'],
    queryFn: async ({ pageParam }) =>
      await getLikedProducts({ cursor: { nextCursor: pageParam } }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  })

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
