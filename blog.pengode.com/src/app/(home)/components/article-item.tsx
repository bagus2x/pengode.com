import { Badge } from '@pengode/blog/components/ui/badge'
import { Button } from '@pengode/blog/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@pengode/blog/components/ui/card'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@pengode/blog/components/ui/tooltip'
import Article from '@pengode/blog/data/models/article'
import { slugifyId } from '@pengode/blog/lib/utils'
import { formatDistance } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

export interface ArticleItemProps {
	article: Article
}

export default function ArticleItem({ article }: ArticleItemProps) {
	return (
		<Card className='transition-all hover:shadow-2xl'>
			<CardHeader>
				<div className='relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100'>
					<Image
						src={article.thumbnail.url}
						alt={article.title}
						fill
						className='h-full w-full object-cover'
					/>
				</div>
			</CardHeader>
			<CardContent>
				<CardTitle>{article.title}</CardTitle>
				<div className='my-2 flex flex-row gap-2'>
					{article.tags[0] && (
						<Badge variant='outline'>
							<Link
								href={`tags/${slugifyId(
									article.tags[0].id,
									article.tags[0].name
								)}`}
							>
								{article.tags[0].name}
							</Link>
						</Badge>
					)}
					{article.tags[1] && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Badge>{article.tags.length - 1}+</Badge>
								</TooltipTrigger>
								<TooltipContent>
									<p>{article.tags.map((tag) => tag.name).join(', ')}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>
				<CardDescription className='line-clamp-4'>
					{article.summary}
				</CardDescription>
			</CardContent>
			<CardFooter className='justify-between'>
				<span className='text-xs text-muted-foreground'>
					{formatDistance(article.createdAt, new Date(), { addSuffix: true })}
				</span>
				<Link href={`/articles/${slugifyId(article.id, article.title)}`}>
					<Button>Read</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}
