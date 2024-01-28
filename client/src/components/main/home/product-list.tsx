'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ProductItem } from '@pengode/components/main/home/product-item'
import { getProducts } from '@pengode/data/product'

export type ProductListProps = PropsWithClassName & {}

export const ProductList = ({ className }: ProductListProps) => {
  const { data: productPages } = useInfiniteQuery({
    queryKey: ['GET_INFINITE_PRODUCTS'],
    queryFn: async ({ pageParam }) =>
      await getProducts({ cursor: { nextCursor: pageParam } }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  })
  return (
    <section className={cn('mx-auto max-w-screen-xl', className)}>
      <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {productPages?.pages.map((page) =>
          page.items.map((product) => (
            <ProductItem key={product.id} product={product} />
          )),
        )}
      </div>
    </section>
  )
}
