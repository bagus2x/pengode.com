import CopyToClipCoard from '@pengode/blog/app/articles/[slug]/components/copy-to-clipboard'
import '@pengode/blog/app/articles/[slug]/syntax.css'
import { Badge } from '@pengode/blog/components/ui/badge'
import { Separator } from '@pengode/blog/components/ui/separator'
import getArticle from '@pengode/blog/data/api/get-article'
import { getAvatar, parseId } from '@pengode/blog/lib/utils'
import { format } from 'date-fns'
import { Metadata, ResolvingMetadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import rehypeHighlight from 'rehype-highlight'

const Discussion = dynamic(
	() => import('@pengode/blog/app/articles/[slug]/components/discussion'),
	{ ssr: false }
)

interface ArticlesPageProps {
	params: {
		slug: string
	}
}

export async function generateMetadata({
	params,
}: ArticlesPageProps): Promise<Metadata> {
	const articleId = parseId(params.slug) ?? notFound()
	const article = (await getArticle(articleId)) ?? notFound()

	return {
		title: article.title,
	}
}

export default async function ArticlePage({ params }: ArticlesPageProps) {
	const articleId = parseId(params.slug) ?? notFound()
	const article = (await getArticle(articleId)) ?? notFound()
	const { content } = await compileMDX({
		source: article.body,
		options: {
			mdxOptions: {
				rehypePlugins: [rehypeHighlight],
			},
			parseFrontmatter: true,
		},
		components: {
			pre: (props) => (
				<CopyToClipCoard>
					<pre {...props} />
				</CopyToClipCoard>
			),
		},
	})

	return (
		<main className='mt-14 flex min-h-[calc(100vh-theme(space.14))] w-full flex-col'>
			<section className='mx-auto w-full max-w-screen-md px-4 py-8'>
				<h1 className='mx-auto scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
					{article.title}
				</h1>
				{article.author && (
					<div className='my-4 flex items-start space-x-4'>
						<Image
							src={getAvatar(article.author.username)}
							height={32}
							width={32}
							alt={article.author.username}
							className='overflow-clip rounded-full'
						/>
						<div className='flex flex-col space-y-1'>
							<span>{article.author.username}</span>
							<span className='text-sm text-muted-foreground'>
								{format(article.createdAt, 'dd MMMM y, HH:mm')}
							</span>
						</div>
					</div>
				)}
				<Separator className='my-4' />
				<div className='flex w-full flex-col'>
					<Image
						src={article.thumbnail.url}
						width={0}
						height={0}
						alt={article.thumbnail.caption || article.title}
						sizes='100%'
						className='h-auto w-full overflow-clip rounded-2xl border border-border object-cover'
					/>
					{article.thumbnail.caption && (
						<span className='w-full text-center text-sm text-muted-foreground'>
							{article.thumbnail.caption}
						</span>
					)}
				</div>
				<article className='w-ful prose mx-auto mt-8 max-w-screen-md'>
					{content}
				</article>
				<Separator className='my-4' />
				<div className='my-4 flex gap-2'>
					{article.tags.map((tag) => (
						<Badge key={tag.id}>{tag.name}</Badge>
					))}
				</div>
			</section>
			<section className='mx-auto w-full max-w-screen-md p-4'>
				<Discussion article={article} />
			</section>
		</main>
	)
}
