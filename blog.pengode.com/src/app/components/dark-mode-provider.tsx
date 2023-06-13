'use client'

import { useDarkMode } from '@pengode/blog/lib/hooks/use-dark-mode'
import { isServerSide } from '@pengode/blog/lib/utils'
import { useEffect } from 'react'

interface DarkModeProps {
	children: React.ReactNode
}

export default function DarkModeProvider({ children }: DarkModeProps) {
	const { mode } = useDarkMode()

	useEffect(() => {
		if (isServerSide) {
			return
		}

		if (
			mode === 'dark' ||
			(mode === 'system' &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark')
		}
		if (
			mode === 'light' ||
			(mode === 'system' &&
				window.matchMedia('(prefers-color-scheme: light)').matches)
		) {
			document.documentElement.classList.remove('dark')
		}
	}, [mode])

	return <>{children}</>
}
