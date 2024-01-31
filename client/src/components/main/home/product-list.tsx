'use client'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ProductItem } from '@pengode/components/main/home/product-item'
import { Product } from '@pengode/data/product/product'
import { useGetProductsQuery } from '@pengode/data/product/product-hook'
import { Page } from '@pengode/data/types'
import { useInView } from 'framer-motion'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useRef } from 'react'

export type ProductListProps = PropsWithClassName & {
  products: Page<Product>
}

export const ProductList = ({ className, products }: ProductListProps) => {
  const { data: productPages, ...getProductsQuery } = useGetProductsQuery({
    initialData: products,
  })
  const loaderRef = useRef<HTMLDivElement>(null)
  const inView = useInView(loaderRef)

  useEffect(() => {
    if (inView && getProductsQuery.hasNextPage) getProductsQuery.fetchNextPage()
  }, [inView, getProductsQuery])

  return (
    <section className={cn('mx-auto max-w-screen-xl', className)}>
      <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {productPages?.pages.map((page) =>
          page.items.map((product) => (
            <ProductItem key={product.id} product={product} />
          )),
        )}
      </div>
      <div className='relative flex items-center justify-center'>
        <div
          ref={loaderRef}
          className='absolute left-1/2 top-1/2 mt-14 -translate-x-1/2 -translate-y-1/2 transform'>
          <Loader2Icon
            className={cn(
              'animate-spin',
              !getProductsQuery.isFetching && 'hidden',
            )}
          />
        </div>
      </div>
    </section>
  )
}
