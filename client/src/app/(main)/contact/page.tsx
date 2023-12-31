import { Contact } from '@pengode/components/contact/contact'
import { MotionMain } from '@pengode/components/ui/motion'

export default function ContactPage() {
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
      <Contact />
    </MotionMain>
  )
}
