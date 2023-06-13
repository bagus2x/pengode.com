'use client'

import PengodeLogo from '@pengode/blog/app/components/pengode-logo'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@pengode/blog/components/ui/dropdown-menu'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@pengode/blog/components/ui/navigation-menu'
import { useDarkMode } from '@pengode/blog/lib/hooks/use-dark-mode'
import { cn } from '@pengode/blog/lib/utils'
import {
	Monitor as MonitorIcon,
	Moon as MoonIcon,
	Sun1 as SunIcon,
} from 'iconsax-react'
import Link from 'next/link'

export default function Header() {
	const { mode, isSystemInDarkMode, setMode } = useDarkMode()

	return (
		<header className='fixed left-0 top-0 z-50 h-14 w-full px-4 py-2 ring-1 ring-border backdrop-blur-md'>
			<div className='mx-auto flex w-full max-w-screen-xl justify-between space-x-4'>
				<PengodeLogo size={40} />
				<NavigationMenu className='grow-0'>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink
								className={cn(navigationMenuTriggerStyle(), 'bg-transparent')}
								asChild
							>
								<Link href='/'>Home</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink
								className={cn(navigationMenuTriggerStyle(), 'bg-transparent')}
								asChild
							>
								<Link href='/about'>About Me</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem className='flex items-center'>
							<DropdownMenu>
								<DropdownMenuTrigger className='outline-none'>
									{(mode === 'dark' ||
										(mode === 'system' && isSystemInDarkMode)) && (
										<MoonIcon
											size={24}
											className='mx-4 my-2 text-gray-800 dark:text-white'
										/>
									)}
									{(mode === 'light' ||
										(mode === 'system' && !isSystemInDarkMode)) && (
										<SunIcon
											size={24}
											className='mx-4 my-2 text-gray-800 dark:text-white'
										/>
									)}
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuGroup>
										<DropdownMenuItem
											className={cn(
												'flex space-x-4',
												mode === 'light' && 'font-bold'
											)}
											onClick={() => setMode('light')}
										>
											<MoonIcon />
											<span>Light</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											className={cn(
												'flex space-x-4',
												mode === 'dark' && 'font-bold'
											)}
											onClick={() => setMode('dark')}
										>
											<SunIcon />
											<span>Dark</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											className={cn(
												'flex space-x-4',
												mode === 'system' && 'font-bold'
											)}
											onClick={() => setMode('system')}
										>
											<MonitorIcon />
											<span>System</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</header>
	)
}
