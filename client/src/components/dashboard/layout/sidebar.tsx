'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  NewspaperIcon as BlogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  PuzzleIcon as ProjectIcon,
  SettingsIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { cn } from '@pengode/common/tailwind'
import { ArrayElement, PropsWithClassName } from '@pengode/common/types'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@pengode/components/ui/collapsible'

const menus = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    Icon: HomeIcon,
  },
  {
    name: 'Blog',
    href: '/dashboard/article',
    Icon: BlogIcon,
    sub: [
      {
        name: 'Overview',
        href: '/dashboard/article',
      },
      {
        name: 'Editor',
        href: '/dashboard/article/editor',
      },
      {
        name: 'Trash',
        href: '/dashboard/article/trash',
      },
    ],
  },
  {
    name: 'Project',
    href: '/dashboard/project',
    Icon: ProjectIcon,
    sub: [
      {
        name: 'Overview',
        href: '/dashboard/project',
      },
      {
        name: 'New',
        href: '/dashboard/project/new',
      },
      {
        name: 'Trash',
        href: '/dashboard/project/trash',
      },
    ],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    Icon: SettingsIcon,
  },
]

export type SidebarProps = PropsWithClassName & {
  collapsible: boolean
  onCollapsibleChange: (value: boolean) => void
}

type MenuItemProps = PropsWithClassName &
  ArrayElement<typeof menus> & {
    collapsible: boolean
    selected: boolean
  }

const MenuItem = ({
  className,
  collapsible,
  selected,
  name,
  href,
  Icon,
  sub,
}: MenuItemProps) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (sub?.length) {
    return (
      <Collapsible asChild onOpenChange={setOpen}>
        <li
          key={href + name}
          className='flex w-full flex-col bg-background px-4'>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                className,
                'flex h-12 items-center gap-4 rounded-xl px-4 text-muted-foreground transition-all duration-500 hover:bg-primary/5',
                selected && 'bg-primary/20 font-semibold text-primary',
              )}>
              <Icon className='shrink-0' size={16} />
              <span
                className={cn(
                  'sr-only text-start group-hover:not-sr-only',
                  !collapsible && 'not-sr-only',
                )}>
                {name}
              </span>
              <span className='flex-1' />
              <ChevronRightIcon
                size={16}
                className={cn('transition-all', open && 'rotate-90')}
              />
            </button>
          </CollapsibleTrigger>
          <AnimatePresence>
            {open ? (
              <CollapsibleContent asChild forceMount>
                <motion.ul
                  initial={{ height: 0 }}
                  animate={{
                    height: 'auto',
                  }}
                  exit={{ height: 0 }}
                  className={cn(
                    'mt-1 hidden w-full flex-col overflow-hidden bg-background',
                    collapsible && 'group-hover:flex',
                    !collapsible && 'flex',
                  )}>
                  {sub.map(({ name: subName, href: subHref }) => {
                    const selected =
                      (pathname.startsWith(subHref) && subHref !== href) ||
                      (pathname === href && subHref === href)

                    return (
                      <li key={subName + subHref}>
                        <Link
                          href={subHref}
                          className='flex h-12 items-center gap-4 rounded-xl px-4 text-muted-foreground transition-all duration-500 hover:bg-primary/5'>
                          <div className='grid shrink-0 place-items-center'>
                            <div
                              className={cn(
                                'h-[5px] w-[5px] rounded-full bg-muted-foreground',
                                selected && 'ring-4 ring-primary/20',
                              )}></div>
                          </div>
                          <span
                            className={cn(
                              'sr-only group-hover:not-sr-only',
                              !collapsible && 'not-sr-only',
                              selected && 'text-foreground',
                            )}>
                            {subName}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </motion.ul>
              </CollapsibleContent>
            ) : null}
          </AnimatePresence>
        </li>
      </Collapsible>
    )
  }

  return (
    <li key={href + name} className='flex w-full flex-col bg-background px-4'>
      <Link
        href={href}
        className={cn(
          className,
          'flex h-12 items-center gap-4 rounded-xl px-4 text-muted-foreground transition-all duration-500 hover:bg-primary/5',
          selected && 'bg-primary/20 font-semibold text-primary',
        )}>
        <Icon className='shrink-0' size={16} />
        <span
          className={cn(
            'sr-only group-hover:not-sr-only',
            !collapsible && 'not-sr-only',
          )}>
          {name}
        </span>
      </Link>
    </li>
  )
}

export function Sidebar({
  className,
  collapsible,
  onCollapsibleChange,
}: SidebarProps) {
  const pathname = usePathname()

  const handleDockedChange = () => {
    onCollapsibleChange(!collapsible)
  }

  return (
    <aside
      className={cn(
        'group h-screen w-20 bg-background py-4 shadow-md transition-all duration-500 hover:w-60',
        className,
        !collapsible && 'w-60',
      )}>
      <div className='relative my-4'>
        <Image
          src='/assets/astronaut.svg'
          alt='Pengode'
          width={32}
          height={32}
          className='ms-6 h-8 w-8'
          priority
        />
        <button
          onClick={handleDockedChange}
          className={cn(
            'absolute end-0 top-1/2 -me-3 hidden -translate-y-1/2 rounded-full bg-primary text-primary-foreground ring-8 ring-gray-100 transition-all group-hover:block',
            collapsible ? 'rotate-180' : 'block rotate-0',
          )}>
          <ChevronLeftIcon />
        </button>
      </div>
      <ul className='flex w-full flex-col gap-1 overflow-x-hidden'>
        {menus.map(({ name, href, Icon, sub }) => {
          const selected =
            (pathname.startsWith(href) && href !== '/dashboard') ||
            (pathname === '/dashboard' && href === '/dashboard')

          return (
            <MenuItem
              key={name + href}
              name={name}
              href={href}
              Icon={Icon}
              collapsible={collapsible}
              selected={selected}
              sub={sub}
            />
          )
        })}
      </ul>
    </aside>
  )
}
