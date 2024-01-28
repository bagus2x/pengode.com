import { Star1 as StarIcon } from 'iconsax-react'
import React, { useMemo } from 'react'

import { cn } from '@pengode/common/tailwind'

export interface RatingBarProps
  extends Omit<React.InputHTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number
  onChange?: (value: number) => void
  max?: number
  itemClassName?: string
}

export const RatingBar = React.forwardRef<HTMLDivElement, RatingBarProps>(
  ({ value, onChange, max = 5, className, itemClassName, ...props }, ref) => {
    const items = useMemo(
      () =>
        Array(max)
          .fill(0)
          .map((_, index) => (
            <button
              type='button'
              key={index}
              onClick={() => onChange?.(index + 1)}>
              <StarIcon
                variant={value >= index + 1 ? 'Bold' : 'Outline'}
                className={cn('h-6 w-6', itemClassName)}
              />
            </button>
          )),
      [itemClassName, max, onChange, value],
    )
    return (
      <div {...props} className={cn('flex gap-3', className)}>
        {items}
      </div>
    )
  },
)

RatingBar.displayName = 'RatingBar'
