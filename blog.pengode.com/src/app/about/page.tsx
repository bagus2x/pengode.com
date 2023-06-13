import { BASE_URL_BLOG } from '@pengode/blog/lib/utils'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'About Tubagus Saifulloh',
	description: `Hello, my name is Tubagus Saifulloh, and I am thrilled to introduce
					myself as a Fullstack Developer. Thank you for visiting this page,
					where I will share a little bit about my journey and dedication in the
					world of development.`,
	openGraph: {
		title: 'About Tubagus Saifulloh',
		images: ['/images/me.jpg'],
		url: `${BASE_URL_BLOG}/about`,
		description: `Hello, my name is Tubagus Saifulloh, and I am thrilled to introduce
					myself as a Fullstack Developer. Thank you for visiting this page,
					where I will share a little bit about my journey and dedication in the
					world of development.`,
	},
}

export default async function AboutPage() {
	return (
		<main className='mt-14'>
			<section className='mx-auto flex max-w-screen-md flex-col items-center p-4'>
				<Image
					src='/images/me.jpg'
					width={200}
					height={200}
					alt='Tubagus Saifulloh'
					className='rounded-full'
				/>
				<div className='mt-4 flex flex-col'>
					<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
						Tubagus Saifulloh
					</h1>
					<Link
						href='mailto:tubagus.sflh@gmail.com'
						className='mt-4 text-center text-sm text-muted-foreground'
					>
						tubagus.sflh@gmail.com
					</Link>
				</div>
				<p className='text-center leading-7 [&:not(:first-child)]:mt-6'>
					Hello, my name is Tubagus Saifulloh, and I am thrilled to introduce
					myself as a Fullstack Developer. Thank you for visiting this page,
					where I will share a little bit about my journey and dedication in the
					world of development.
				</p>
				<div className='mt-4 flex space-x-4'>
					<Link href='https://www.linkedin.com/in/tubagussa'>
						<Image
							src='/images/linkedin.svg'
							width={40}
							height={40}
							alt='Linkedin'
						/>
					</Link>
					<Link href='https://www.github.com/bagus2x'>
						<Image
							src='/images/github.svg'
							width={40}
							height={40}
							alt='Linkedin'
						/>
					</Link>
				</div>
			</section>
		</main>
	)
}
