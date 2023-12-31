import { Metadata } from 'next'

import { Greetings } from '@pengode/components/landing/greetings'
import { MotionMain } from '@pengode/components/ui/motion'

export const metadata: Metadata = {
  title: 'Tubagus Saifulloh',
}

export default function LandingPage() {
  return (
    <MotionMain
      className='min-h-screen py-16'
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <Greetings />
    </MotionMain>
  )
}
