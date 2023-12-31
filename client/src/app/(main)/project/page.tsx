import { ProjectList } from '@pengode/components/project/project-list'
import { MotionMain } from '@pengode/components/ui/motion'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
}

export default function ProjectsPage() {
  return (
    <MotionMain
      className='min-h-screen py-16'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 2,
      }}
    >
      <ProjectList />
    </MotionMain>
  )
}
