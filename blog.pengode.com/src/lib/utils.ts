import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugify from 'slugify'
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const isServerSide = typeof window === 'undefined'

export const isClientSide = typeof window !== 'undefined'

export const slugifyId = (id: number, text: string) => {
	return `${id}-${slugify(text)}`
}

export const parseId = (slug: string) => {
	const id = parseInt(slug.split('-')[0])
	if (isNaN(id)) {
		return null
	}
	return id
}

export const BASE_URL_API_BLOG = process.env.NEXT_PUBLIC_BASE_URL_API_BLOG

export const BASE_URL_BLOG = process.env.NEXT_PUBLIC_BASE_URL_BLOG

export const getAvatar = (seed: string) => {
	return `https://api.dicebear.com/5.x/fun-emoji/jpg?seed=${seed}`
}
