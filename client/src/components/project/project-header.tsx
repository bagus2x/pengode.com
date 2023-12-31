'use client'

import Image from 'next/image'
import { RocketIcon, HeartIcon, GithubIcon } from 'lucide-react'

import { avatar } from '@pengode/common/utils'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Button } from '@pengode/components/ui/button'

export type ProjectHeaderProps = PropsWithClassName & {
  author: {
    name: string
    photo: string | null
  }
  title: string
}

export function ProjectHeader({
  className,
  author,
  title,
}: ProjectHeaderProps) {
  return (
    <section
      className={cn(
        'z-10 mx-auto flex w-full max-w-screen-xl flex-col gap-4 p-4',
        className,
      )}>
      <h1 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
        {title}
      </h1>
      <div className='sticky top-16 flex items-center gap-2 bg-background'>
        <Image
          src={avatar(author.name, author.photo)}
          alt={title}
          width={40}
          height={40}
          className='rounded-full'
        />
        <div className='flex flex-1 flex-col overflow-hidden'>
          <span className='truncate text-sm'>{author.name}</span>
          <span className='text-xs text-muted-foreground'>7 Nov 2023</span>
        </div>
        <Button size='circle' variant='outline'>
          <HeartIcon size={16} />
        </Button>
        <Button size='circle' variant='outline'>
          <GithubIcon size={16} />
        </Button>
        <Button>
          <RocketIcon size={16} className='me-2' />
          Demo
        </Button>
      </div>
    </section>
  )
}
