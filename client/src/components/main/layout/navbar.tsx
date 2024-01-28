'use client'

import Decimal from 'decimal.js'
import {
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
  SunIcon,
  UserIcon,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter, avatar } from '@pengode/common/utils'
import { Button } from '@pengode/components/ui/button'
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
import { signOut } from '@pengode/data/auth'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getProducts as getCartProducts } from '@pengode/data/product-cart'
import { getProducts } from '@pengode/data/product'

export function Navbar({ className }: PropsWithClassName) {
  const session = useSession()
  const [openCommand, setOpenCommand] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const { data: products } = useQuery({
    queryKey: ['GET_PRODUCT_CART'],
    queryFn: async () => await getCartProducts({ size: 6 }),
    select: (data) => data.items,
    enabled: !!session.data,
  })
  const [search, setSearch] = useState('')
  const { data: productPages } = useInfiniteQuery({
    queryKey: ['GET_INFINITE_PRODUCTS', search],
    queryFn: async ({ pageParam }) =>
      await getProducts({ cursor: { nextCursor: pageParam }, search }),
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  })

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

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className={cn('mx-auto w-full max-w-screen-xl', className)}>
      <div className='flex w-full items-center gap-4 overflow-hidden rounded-lg border bg-card p-4 text-card-foreground shadow-sm'>
        <SearchIcon className='text-muted-foreground' />
        <input
          placeholder='Search (Ctrl + /)'
          className='min-w-0 flex-1 bg-transparent text-sm outline-none'
          readOnly
          onClick={() => setOpenCommand(true)}
        />
        {session.data && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='relative outline-none'>
                <ShoppingCartIcon className='text-muted-foreground' />
                {!!products?.length && (
                  <span className='absolute -end-2 -top-2 grid aspect-square h-5 w-5 place-items-center rounded-full bg-green-500 text-xs text-white'>
                    {products.length > 5 ? '5+' : products.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='md:w-96'>
              <DropdownMenuLabel className='flex justify-between gap-4'>
                <div>Your shopping cart</div>
                <Link href='/cart' className='text-primary'>
                  See all
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  {!products?.length && (
                    <p className='w-full text-center'>Empty</p>
                  )}
                </DropdownMenuItem>
                {products?.map((product) => (
                  <DropdownMenuItem key={product.id}>
                    <Image
                      src={product.previewUrl}
                      alt={product.title}
                      width={100}
                      height={100}
                      className='me-4 h-10 w-10 rounded'
                    />
                    <span className='me-4 line-clamp-2 flex-1'>
                      {product.title}
                    </span>
                    <div className='ml-auto flex flex-col text-xs tracking-widest'>
                      <span className='font-semibold'>
                        {RupiahFormatter.format(
                          new Decimal(product.price).sub(
                            new Decimal(product.price).times(
                              product.discount || 0,
                            ),
                          ),
                        )}
                      </span>
                      <span className='scale-90 text-muted-foreground line-through'>
                        {RupiahFormatter.format(product.price)}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
        {!session.data?.user && (
          <div className='flex gap-2'>
            <Button asChild size='sm'>
              <Link href='/signin'>Log in</Link>
            </Button>
            <Button asChild size='sm' variant='outline'>
              <Link href='/signup'>Register</Link>
            </Button>
          </div>
        )}
        {session.data?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='relative h-8 w-8 shrink-0 rounded-full bg-secondary outline-none'>
                <Image
                  src={avatar(session.data.user.name, session.data.user.image)}
                  width={32}
                  height={32}
                  alt={session.data?.user.name || 'Photo of user'}
                  className='overflow-hidden rounded-full'
                />
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
                    <span>{session.data.user.name}&lsquo;s profile</span>
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
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon className='me-2 h-4 w-4' />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <CommandDialog
        open={openCommand}
        onOpenChange={setOpenCommand}
        shouldFilter={false}>
        <CommandInput
          placeholder='Type a command or search...'
          onValueChange={setSearch}
        />
        <CommandList className='scrollbar-thin'>
          <CommandEmpty>No results found.</CommandEmpty>
          {!!productPages?.pages[0]?.items.length && (
            <CommandGroup heading='Suggestions'>
              {productPages.pages.map((page) =>
                page.items.map((product) => (
                  <CommandItem key={product.id}>
                    <Image
                      src={product.previewUrl}
                      width={80}
                      height={80}
                      alt={product.title}
                      className='me-2 h-4 w-4 rounded'
                    />
                    <span>{product.title}</span>
                  </CommandItem>
                )),
              )}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </nav>
  )
}
