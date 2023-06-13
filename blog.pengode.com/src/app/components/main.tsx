'use client'

import { cn } from '@pengode/blog/lib/utils'
import { HTMLMotionProps, motion } from 'framer-motion'

export default function Main({
	className,
	initial = {
		opacity: 0,
	},
	animate = {
		opacity: 1,
	},
	...props
}: HTMLMotionProps<'main'>) {
	return <motion.main {...props} className={cn('mt-14')} />
}
