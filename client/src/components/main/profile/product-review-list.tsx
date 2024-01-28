'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ProductItem } from '@pengode/components/main/profile/product-item'
import { getLikedProducts } from '@pengode/data/product'
import { getProductReviewsByAuthUser } from '@pengode/data/product-review'
import { ProductReviewItem } from '@pengode/components/main/profile/product-review-item'

export type ProductReviewListProps = PropsWithClassName & {}

export const ProductReviewList = ({ className }: ProductReviewListProps) => {
  const { data: reviewPages } = useInfiniteQuery({
    queryKey: ['GET_INFINITE_PRODUCT_REVIEW_BY_AUTH_USER'],
    queryFn: async ({ pageParam }) =>
      await getProductReviewsByAuthUser({ cursor: { nextCursor: pageParam } }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  })

  return (
    <div className={cn('flex flex-col gap-4 py-1', className)}>
      <h6 className='text-lg font-semibold'>Reviews ✨</h6>
      {reviewPages?.pages.map((page) =>
        page.items.map((review) => (
          <ProductReviewItem
            key={review.id}
            review={review}
            className='w-full'
          />
        )),
      )}
    </div>
  )
}
