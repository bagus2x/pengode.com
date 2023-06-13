'use client'

import { useToast } from '@pengode/blog/components/ui/use-toast'
import { Copy } from 'iconsax-react'
import { useRef } from 'react'

export default function CopyToClipCoard({
	children,
}: {
	children: React.ReactNode
}) {
	const ref = useRef<HTMLDivElement | null>(null)
	const { toast } = useToast()

	const handleCopy = () => {
		if (ref?.current?.textContent) {
			navigator.clipboard.writeText(ref.current.textContent)
			toast({ description: 'Text copied to clipboard' })
		}
	}

	return (
		<div className='relative' ref={ref}>
			<Copy
				size={16}
				onClick={handleCopy}
				className='absolute right-2 top-2 cursor-pointer self-end text-white'
			/>
			{children}
		</div>
	)
}
