import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RatingBar } from '@pengode/components/ui/rating-bar'
import { ProductReview } from '@pengode/data/product-review/product-review'

export type ProductReviewItemProps = PropsWithClassName & {
  review: ProductReview
}

export const ProductReviewItem = ({
  className,
  review,
}: ProductReviewItemProps) => {
  return (
    <Link
      href={`/product/${review.product.id}#reviews`}
      className={cn(
        'flex cursor-pointer gap-4 rounded-2xl transition-all hover:bg-secondary',
        className,
      )}>
      <Image
        src={review.product.previewUrl}
        alt={review.product.title}
        width={120}
        height={120}
        className='h-16 w-16 rounded-xl'
      />
      <div className='flex flex-col justify-center'>
        <div className='font-semibold'>{review.product.title}</div>
        <RatingBar
          value={review.star}
          className='gap-1'
          itemClassName='w-3 h-3 text-yellow-400'
        />
        <div className='flex items-center text-sm text-muted-foreground'>
          <ReactMarkdown className='prose mx-auto mb-4 w-full max-w-screen-xl'>
            {review.description}
          </ReactMarkdown>
        </div>
      </div>
    </Link>
  )
}
