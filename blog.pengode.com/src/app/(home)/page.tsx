import ArticlesList from '@pengode/blog/app/(home)/components/articles-list'
import getArticles from '@pengode/blog/data/api/get-articles'

export default async function HomePage() {
	const articles = await getArticles(1, 20)

	return (
		<main className='mt-14 flex min-h-[calc(100vh-theme(space.14))] w-full flex-col'>
			<ArticlesList initialArticles={articles} />
		</main>
	)
}
