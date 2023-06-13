import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

type ColorMode = 'light' | 'dark' | 'system'

export const useDarkMode = (): {
	mode: ColorMode
	setMode: (mode: ColorMode) => void
	isSystemInDarkMode: boolean
} => {
	const queryClient = useQueryClient()
	const { data } = useQuery({
		queryKey: ['color-scheme'],
		queryFn: () => {
			return localStorage.getItem('color-scheme') as ColorMode
		},
	})
	const { mutate } = useMutation<ColorMode, unknown, ColorMode>({
		mutationFn: async (mode) => {
			localStorage.setItem('color-scheme', mode)

			queryClient.setQueryData(['color-scheme'], mode)

			return mode
		},
		mutationKey: ['color-scheme'],
	})
	const [isSystemInDarkMode, setIsSystemInDarkMode] = useState(false)

	useEffect(() => {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', (event) => {
				setIsSystemInDarkMode(event.matches)
			})
	}, [])

	return {
		mode: data || 'system',
		setMode: mutate,
		isSystemInDarkMode: isSystemInDarkMode,
	}
}
