import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Button } from '@pengode/components/ui/button'
import { ScrollArea, ScrollBar } from '@pengode/components/ui/scroll-area'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'

export type ArticleItemProps = PropsWithClassName & {
  id: number
  thumbnail?: string | null
  title: string
  summary?: string | null
  categories: string[]
  readingTime?: number | null
  createdAt: Date
}

dayjs.extend(relativeTime)

export function ArticleItem({
  id,
  thumbnail,
  title,
  summary,
  categories,
  readingTime,
  createdAt,
}: ArticleItemProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row')}>
      <Image
        src={thumbnail || '/assets/no-image-placeholder.svg'}
        width={160}
        height={160}
        alt={title}
        className='aspect-square w-full rounded-2xl object-cover sm:w-40'
      />
      <div className='flex flex-col'>
        <div className='line-clamp-2 text-lg font-semibold'>{title}</div>
        <div className='relative mb-2'>
          <p className='line-clamp-2 min-w-[20ch] text-sm text-muted-foreground'>
            {summary}
          </p>
          <Link
            href={`/article/${id}`}
            className='absolute bottom-0 end-0 bg-background text-sm'>
            &nbsp;&nbsp;...<span className='font-bold'>read more</span>
          </Link>
        </div>
        <div className='mb-2 text-sm'>
          {dayjs().to(createdAt)} • {readingTime || 0} mins read
        </div>
        <ScrollArea className='whitespace-nowrap'>
          <div className='flex gap-2'>
            {categories.map((category) => (
              <Button
                key={category}
                size='sm'
                className='h-auto py-1 text-xs'
                variant='secondary'>
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </div>
  )
}
