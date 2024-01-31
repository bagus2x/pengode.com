'use client'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ProductReviewItem } from '@pengode/components/main/profile/product-review-item'
import { useGetProductReviewsByAuthUserQuery } from '@pengode/data/product-review/product-review-hook'

export type ProductReviewListProps = PropsWithClassName & {}

export const ProductReviewList = ({ className }: ProductReviewListProps) => {
  const { data: reviewPages } = useGetProductReviewsByAuthUserQuery()

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
