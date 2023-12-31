'use client'

import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Astronaut } from '@pengode/components/ui/astronaut'
import { Button } from '@pengode/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@pengode/components/ui/sheet'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'

const menus = [
  { name: 'Home', path: '/' },
  { name: 'Project', path: '/project' },
  { name: 'Article', path: '/article' },
  { name: 'Contact', path: '/contact' },
]

export function Navbar({ className }: PropsWithClassName) {
  const pathname = usePathname()

  return (
    <nav id='navbar' className={cn('bg-background shadow', className)}>
      <div className='mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4'>
        <Link href='/'>
          <Astronaut className='h-10 w-10 cursor-pointer transition-all hover:scale-105' />
        </Link>
        <ul className='relative flex items-center gap-4'>
          {menus.map((item) => {
            const show =
              (pathname.startsWith(item.path) && item.path !== '/') ||
              (item.path === '/' && pathname === '/')

            return (
              <li
                key={item.name}
                className={cn(
                  'relative hidden rounded-2xl transition-all hover:bg-secondary hover:text-secondary-foreground md:block',
                  !show && 'text-foreground/50',
                )}>
                <Link href={item.path} className='block p-2'>
                  {item.name}
                </Link>
              </li>
            )
          })}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </ul>
      </div>
    </nav>
  )
}
