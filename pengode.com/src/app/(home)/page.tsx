import { Button } from '@pengode/components/ui/button'
import { Linkedin, Github } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
	return (
		<main className='flex min-h-screen w-screen flex-col items-center justify-center space-y-4 p-4'>
			<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
				Under Construction
			</h1>
			<div className='flex space-x-4'>
				<Link
					href='https://www.linkedin.com/in/tubagussa'
					className='rounded-full bg-gray-800 p-4 text-white'
				>
					<Linkedin size={24} />
				</Link>
				<Link
					href='https://www.github.com/bagus2x'
					className='rounded-full bg-gray-800 p-4 text-white'
				>
					<Github size={24} />
				</Link>
			</div>
		</main>
	)
}
