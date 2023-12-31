'use client'

import { PropsWithChildren, useState } from 'react'

import { Sidebar } from '@pengode/components/dashboard/layout/sidebar'
import { cn } from '@pengode/common/tailwind'
import { Navbar } from '@pengode/components/dashboard/layout/navbar'

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [collapsible, setCollapsible] = useState(true)

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-background'>
      <Sidebar
        collapsible={collapsible}
        onCollapsibleChange={setCollapsible}
        className='fixed start-0 top-0 z-40 hidden md:block'
      />
      <div
        className={cn(
          'transition-all delay-500',
          collapsible ? 'md:ps-20' : 'md:ps-60',
        )}>
        <Navbar className='p-4' />
        {children}
      </div>
    </div>
  )
}
