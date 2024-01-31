'use client'

import {
  CalendarIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { avatar } from '@pengode/common/utils'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@pengode/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@pengode/components/ui/dropdown-menu'

export function Navbar({ className }: PropsWithClassName) {
  const session = useSession()
  const [openCommand, setOpenCommand] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    if (!session.data?.user) session.update()

    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommand((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [session])

  return (
    <nav className={cn('mx-auto w-full max-w-screen-xl', className)}>
      <div className='flex w-full items-center gap-4 overflow-hidden rounded-lg border bg-card p-4 text-card-foreground shadow-sm'>
        <SearchIcon className='text-muted-foreground' />
        <input
          placeholder='Search (Ctrl + /)'
          className='flex-1 bg-transparent text-sm outline-none'
          readOnly
          onClick={() => setOpenCommand(true)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='outline-none'>
              <SunIcon className='text-muted-foreground' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <SunIcon className='me-2 h-4 w-4' />
              <span>Light</span>
              {resolvedTheme === 'light' && (
                <DropdownMenuShortcut>✓</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <MoonIcon className='me-2 h-4 w-4' />
              <span>Dark</span>
              {resolvedTheme === 'dark' && (
                <DropdownMenuShortcut>✓</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <MonitorIcon className='me-2 h-4 w-4' />
              <span>System</span>
              {resolvedTheme === 'system' && (
                <DropdownMenuShortcut>✓</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='relative h-8 w-8 shrink-0 rounded-full bg-secondary outline-none'>
              {session.data?.user && (
                <Image
                  src={avatar(session.data.user.name, session.data.user.image)}
                  width={32}
                  height={32}
                  alt={session.data?.user.name || 'Photo of user'}
                  className='overflow-hidden rounded-full'
                />
              )}
              <span className='absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-background bg-green-600' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href='/profile'>
                  <UserIcon className='me-2 h-4 w-4' />
                  <span>{session.data?.user.name}&lsquo;s profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className='me-2 h-4 w-4' />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon className='me-2 h-4 w-4' />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder='Type a command or search...' />
        <CommandList className='scrollbar-thin'>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Suggestions'>
            <CommandItem>
              <CalendarIcon className='me-2 h-4 w-4' />
              <span>Calendar</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Settings'>
            <CommandItem>
              <UserIcon className='me-2 h-4 w-4' />
              <span>Profile</span>
            </CommandItem>
            <CommandItem>
              <SettingsIcon className='me-2 h-4 w-4' />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </nav>
  )
}
