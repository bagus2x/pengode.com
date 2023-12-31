'use client'

import Lottie from 'lottie-react'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'

import astronautAnimationData from '@pengode/components/landing/astronaut-coding-animation.json'
import { ButtonSocials } from '@pengode/components/landing/button-socials'
import { AspectRatio } from '@pengode/components/ui/aspect-ratio'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'

export function Greetings({ className }: PropsWithClassName) {
  const greetingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const typed = new Typed(greetingRef.current, {
      strings: ["Hi, I'm Tubagus", 'Welcome (⌐■_■)'],
      startDelay: 100,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 2000,
      loop: true,
    })

    return () => {
      typed.destroy()
    }
  }, [])

  return (
    <section
      id='greetings'
      className={cn(
        'mx-auto flex max-w-screen-xl flex-col p-4 md:flex-row',
        className,
      )}>
      <div className='flex flex-1 flex-col justify-center'>
        <div className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          <h1 className='sr-only'>Hi, I&apos;m Tubagus</h1>
          <span className='inline' ref={greetingRef}>
            <span className='opacity-0'>H</span>
          </span>
        </div>
        <span className='text-xl text-muted-foreground'>
          Fullstack Developer
        </span>
        <p className='mt-2'>
          As a lifelong learner, I&apos;m always excited to pick up new skills
          and stay updated with the latest tech trends. I&apos;m passionate
          about creating awesome solutions, and I believe in the power of
          continuous growth.
        </p>
        <ButtonSocials className='hidden md:mt-20 md:flex' />
      </div>
      <div className='flex-1'>
        <AspectRatio ratio={1 / 1}>
          <Lottie
            animationData={astronautAnimationData}
            loop
            style={{ scale: 1.25 }}
          />
        </AspectRatio>
      </div>
      <ButtonSocials className='mx-auto mt-20 md:hidden' />
    </section>
  )
}
