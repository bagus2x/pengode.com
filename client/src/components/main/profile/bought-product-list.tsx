'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { BoughtProductItem } from '@pengode/components/main/profile/bought-product-item'
import { getBoughtProducts } from '@pengode/data/product'

export type BoughtProductListProps = PropsWithClassName & {}

export const BoughtProductList = ({ className }: BoughtProductListProps) => {
  const { data: productPages } = useInfiniteQuery({
    queryKey: ['GET_INFINITE_BOUGHT_PRODUCTS'],
    queryFn: async ({ pageParam }) =>
      await getBoughtProducts({ cursor: { nextCursor: pageParam } }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  })

  return (
    <div className={cn('flex flex-col gap-4 py-1', className)}>
      <h6 className='text-lg font-semibold'>Bought Products 🖥️</h6>
      {productPages?.pages.map((page) =>
        page.items.map((product, index) => (
          <BoughtProductItem key={index} product={product} className='w-full' />
        )),
      )}
    </div>
  )
}
