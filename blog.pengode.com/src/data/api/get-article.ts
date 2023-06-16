import HttpErrorResponse from '@pengode/blog/data/api/http-error-response'
import Article from '@pengode/blog/data/models/article'
import { BASE_URL_API_BLOG } from '@pengode/blog/lib/utils'

const getArticle = async (articleId: number): Promise<Article | null> => {
	const params = new URLSearchParams({
		populate: '*',
	} as any)

	const res = await fetch(
		`${BASE_URL_API_BLOG}/api/articles/${articleId}?${params.toString()}`,
		{
			next: { revalidate: 0 },
		}
	)
	if (!res.ok) {
		const error = (await res.json()) as HttpErrorResponse
		throw new Error(error.error.message)
	}

	const { data: article } = (await res.json()) as GetArticleResponse

	return {
		id: article.id,
		title: article.attributes.title,
		body: article.attributes.body,
		summary: article.attributes.summary,
		thumbnail: {
			id: article.attributes.thumbnail.data.id,
			name: article.attributes.thumbnail.data.attributes.name,
			url: article.attributes.thumbnail.data.attributes.url.startsWith('/')
				? `${BASE_URL_API_BLOG}${article.attributes.thumbnail.data.attributes.url}`
				: article.attributes.thumbnail.data.attributes.url,
			mime: article.attributes.thumbnail.data.attributes.mime,
			ext: article.attributes.thumbnail.data.attributes.ext,
			alternativeText:
				article.attributes.thumbnail.data.attributes.alternativeText,
			caption: article.attributes.thumbnail.data.attributes.caption,
			width: article.attributes.thumbnail.data.attributes.width,
			height: article.attributes.thumbnail.data.attributes.height,
			size: article.attributes.thumbnail.data.attributes.size,
		},
		author: article.attributes.author
			? {
					id: article.attributes.author.data.id,
					username: article.attributes.author.data.attributes.username,
			  }
			: undefined,
		tags: article.attributes.tags.data.map((tag) => ({
			id: tag.id,
			name: tag.attributes.name,
		})),
		createdAt: new Date(article.attributes.createdAt),
		updatedAt: new Date(article.attributes.updatedAt),
	}
}

export default getArticle

type GetArticleResponse = {
	data: {
		id: number
		attributes: {
			title: string
			body: string
			createdAt: string
			updatedAt: string
			publishedAt: string
			locale: string
			summary: string
			thumbnail: {
				data: {
					id: number
					attributes: {
						name: string
						alternativeText: string
						caption: string
						width: number
						height: number
						formats: {
							thumbnail?: {
								name: string
								hash: string
								ext: string
								mime: string
								path: string
								width: number
								height: number
								size: number
								url: string
							}
							large?: {
								name: string
								hash: string
								ext: string
								mime: string
								path: string
								width: number
								height: number
								size: number
								url: string
							}
							medium?: {
								name: string
								hash: string
								ext: string
								mime: string
								path: string
								width: number
								height: number
								size: number
								url: string
							}
							small?: {
								name: string
								hash: string
								ext: string
								mime: string
								path: string
								width: number
								height: number
								size: number
								url: string
							}
						}
						hash: string
						ext: string
						mime: string
						size: number
						url: string
						previewUrl: string
						provider: string
						provider_metadata: any
						createdAt: string
						updatedAt: string
					}
				}
			}
			author?: {
				data: {
					id: number
					attributes: {
						username: string
						email: string
						provider: string
						confirmed: boolean
						blocked: boolean
						createdAt: string
						updatedAt: string
					}
				}
			}
			tags: {
				data: Array<{
					id: number
					attributes: {
						name: string
						createdAt: string
						updatedAt: string
						publishedAt: string
					}
				}>
			}
			localizations: {
				data: Array<string>
			}
		}
	}
}