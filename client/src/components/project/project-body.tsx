import { MDXRemote } from 'next-mdx-remote/rsc'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'

export type ProjectBodyProps = PropsWithClassName & {
  body: string
}

export function ProjectBody({ className, body }: ProjectBodyProps) {
  return (
    <section
      className={cn('prose-sm mx-auto w-full max-w-screen-xl p-4', className)}>
      <MDXRemote source={'# Hello World'} />
    </section>
  )
}
