'use client'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { GoogleLogin } from '@pengode/components/google-oauth'

export const CommentList = ({ className }: PropsWithClassName) => {
  return (
    <section className={cn('mx-auto max-w-screen-xl', className)}>
      <GoogleLogin
        useOneTap
        onSuccess={(data) => {
          console.log(data)
        }}
      />
    </section>
  )
}
