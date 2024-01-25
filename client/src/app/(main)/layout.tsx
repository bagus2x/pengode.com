import { Navbar } from '@pengode/components/main/layout/navbar'
import { PropsWithChildren } from 'react'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className='min-h-screen bg-gray-100 dark:bg-background'>
      <Navbar className='p-4' />
      {children}
    </div>
  )
}
