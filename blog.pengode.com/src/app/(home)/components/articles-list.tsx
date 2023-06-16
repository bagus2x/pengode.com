'use client'

import ArticleItem from '@pengode/blog/app/(home)/components/article-item'
import { Input } from '@pengode/blog/components/ui/input'
import { useToast } from '@pengode/blog/components/ui/use-toast'
import useSearchArticles from '@pengode/blog/data/hooks/use-search-articles'
import Article from '@pengode/blog/data/models/article'
import { Paging } from '@pengode/blog/data/models/paging'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

export interface ArticleListProps {
	initialArticles: Paging<Article>
}

export default function ArticlesList({ initialArticles }: ArticleListProps) {
	const {
		params,
		setParams,
		data,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
		isError,
		error,
	} = useSearchArticles(initialArticles)
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref)
	const { toast } = useToast()

	useEffect(() => {
		if (hasNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, fetchNextPage])

	useEffect(() => {
		if (isError) {
			toast({
				description: error?.message || 'Error has occured',
				variant: 'destructive',
			})
		}
	}, [isError, error, toast])

	return (
		<div className='w-full'>
			<section className='mx-auto w-full max-w-screen-xl space-y-4 rounded-2xl bg-accent p-4 px-4 py-8 text-accent-foreground'>
				<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl'>
					👨‍💻 Tubagus Saifulloh
				</h1>
				<h4 className='scroll-m-20 text-center text-xl font-semibold tracking-tight'>
					Here is where you can discover all of my technology-related articles
				</h4>
				<Input
					placeholder='Search...'
					className='mx-auto max-w-2xl bg-background bg-opacity-50'
					value={params.search || ''}
					onChange={(e) => {
						setParams({ ...params, search: e.target.value })
					}}
				/>
			</section>
			<section className='mx-auto w-full max-w-screen-xl columns-1 p-4 md:columns-2 lg:columns-3'>
				<AnimatePresence>
					{data?.pages.map((articles) =>
						articles.data.map((article, index) => (
							<motion.article
								key={article.id}
								className='mb-4 w-full break-inside-avoid'
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0 }}
								transition={{ delay: (index + 1) * 0.1 }}
							>
								<ArticleItem article={article} />
							</motion.article>
						))
					)}
				</AnimatePresence>
			</section>
			<div className='mt-8 flex justify-center'>
				<div ref={ref} className='sr-only' />
				{isFetchingNextPage && <Loader2 className='animate-spin' size={32} />}
			</div>
		</div>
	)
}
