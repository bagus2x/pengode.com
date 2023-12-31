import { PlusCircleIcon } from 'lucide-react'
import * as React from 'react'
import { useMemo } from 'react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ScrollArea, ScrollBar } from '@pengode/components/ui/scroll-area'
import Image from 'next/image'

export type ImageUploaderProps = PropsWithClassName & {
  files: (File | string)[]
  onChange: (files: File[]) => void
  multiple?: boolean
}

export const ImageUploader = React.forwardRef<
  HTMLDivElement,
  ImageUploaderProps
>(({ className, multiple, files, onChange, ...props }, ref) => {
  const urls = useMemo(
    () =>
      files.map((file) =>
        file instanceof File ? URL.createObjectURL(file) : file,
      ),
    [files],
  )

  return (
    <ScrollArea
      {...props}
      ref={ref}
      className={cn('rounded-md border-2 border-input p-2', className)}>
      <div className='flex flex-nowrap items-start justify-start gap-2'>
        <div
          className='relative grid h-20 w-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-md border-2 border-dashed border-input'
          role='button'>
          <PlusCircleIcon size={16} className='text-foreground/50' />
          <input
            type='file'
            multiple={multiple}
            className='absolute end-0 start-0 h-full w-full cursor-pointer opacity-0 outline-none'
            onChange={(ev) => {
              if (!ev.target.files) return
              onChange(Array.from(ev.target.files))
            }}
          />
        </div>
        {urls.map((url) => (
          <div key={url} className='relative shrink-0'>
            <Image
              key={url}
              src={url}
              width={80}
              height={80}
              alt='Preview'
              className='aspect-square overflow-hidden rounded-md'
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation='horizontal' className='mt-4' />
    </ScrollArea>
  )
})
ImageUploader.displayName = 'ImageUploader'
