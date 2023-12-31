import Image from 'next/image'
import Link from 'next/link'
import { EyeIcon } from 'lucide-react'

import { AspectRatio } from '@pengode/components/ui/aspect-ratio'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { avatar } from '@pengode/common/utils'

export type ProjectItemProps = PropsWithClassName & {
  id: number
  title: string
  image: string
  summary: string
  author: {
    name: string
    photo: string | null
  }
}

export function ProjectItem({
  id,
  className,
  title,
  image,
  summary,
  author,
}: ProjectItemProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <AspectRatio
        ratio={1 / 1}
        className='relative mb-4 overflow-hidden rounded-2xl'
        asChild>
        <Link href={`/project/${id}`}>
          <Image
            src={image}
            fill
            sizes='100%'
            alt={title}
            className='h-full w-full'
          />
          <h4 className='absolute bottom-0 start-0 w-full scroll-m-20 bg-gradient-to-b from-transparent from-10% to-black/60 to-90% p-4 text-xl tracking-tight text-white'>
            {title}
          </h4>
          <p className='sr-only'>{summary}</p>
        </Link>
      </AspectRatio>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Image
            src={avatar(author.name, author.photo)}
            alt={author.name}
            width={24}
            height={24}
            className='rounded-full'
          />
          <span className='text-sm font-semibold'>{author.name}</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='text-sm text-muted-foreground'>2</span>
          <EyeIcon size={14} className='text-muted-foreground' />
        </div>
      </div>
    </div>
  )
}
