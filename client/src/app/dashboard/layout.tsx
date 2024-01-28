'use client'

import { useSession } from 'next-auth/react'
import { PropsWithChildren, useState } from 'react'
import { Loader2Icon } from 'lucide-react'

import { cn } from '@pengode/common/tailwind'
import { Navbar } from '@pengode/components/dashboard/layout/navbar'
import { Sidebar } from '@pengode/components/dashboard/layout/sidebar'
import { redirect } from 'next/navigation'

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [collapsible, setCollapsible] = useState(true)
  const session = useSession({ required: true })

  if (session.status === 'loading') {
    return (
      <div className='min-h-screen w-full'>
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform '>
          <Loader2Icon className='animate-spin' />
        </div>
      </div>
    )
  }

  const isAdmin = session.data.user.roles.some((role) => role.name === 'ADMIN')
  if (!isAdmin) {
    redirect('/')
  }

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
