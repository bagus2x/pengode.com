'use client'

import Lottie from 'lottie-react'

import astronautAnimationData from '@pengode/components/contact/astronaut-rocket-animation.json'
import { AspectRatio } from '@pengode/components/ui/aspect-ratio'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ContactForm } from '@pengode/components/contact/contact-form'

export function Contact({ className }: PropsWithClassName) {
  return (
    <section
      id='greetings'
      className={cn(
        'mx-auto flex max-w-screen-xl flex-col p-4 md:flex-row',
        className,
      )}>
      <div className='flex-1'>
        <AspectRatio ratio={1 / 1}>
          <Lottie animationData={astronautAnimationData} loop />
        </AspectRatio>
      </div>
      <div className='flex flex-1 flex-col justify-center'>
        <h1 className='mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Contact Me!
        </h1>
        <ContactForm />
      </div>
    </section>
  )
}
