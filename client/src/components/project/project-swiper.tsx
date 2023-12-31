'use client'

import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import { AspectRatio } from '@pengode/components/ui/aspect-ratio'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import Image from 'next/image'

export type ProjectPreviewProps = PropsWithClassName & {
  previews: { image: string; title?: string | null }[]
}

export function ProjectPreview({ className, previews }: ProjectPreviewProps) {
  return (
    <section className={cn('mx-auto w-full max-w-screen-xl p-4', className)}>
      <Swiper
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        className='overflow-hidden rounded-xl'
        spaceBetween={16}>
        {previews.map((preview) => (
          <SwiperSlide key={preview.image}>
            <AspectRatio
              ratio={3 / 2.5}
              className='relative overflow-hidden rounded-xl'>
              <Image
                src={preview.image}
                alt={preview.title || 'Preview'}
                className='h-full w-full'
                fill
                sizes='100%'
              />
            </AspectRatio>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
