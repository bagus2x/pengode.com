import { PropsWithChildren } from 'react'

import { Navbar } from '@pengode/components/main/navbar'
import { AnimatePresence } from '@pengode/components/ui/motion'

export default function IntroductionLayout({ children }: PropsWithChildren) {
  return (
    <div className='min-h-screen overflow-x-hidden'>
      <Navbar className='fixed start-0 top-0 z-40 w-full' />
      <AnimatePresence mode='wait'>{children}</AnimatePresence>
    </div>
  )
}
