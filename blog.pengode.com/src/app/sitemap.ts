import { BASE_URL_BLOG } from '@pengode/blog/lib/utils'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: BASE_URL_BLOG!!,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL_BLOG}/about`,
			lastModified: new Date(),
		},
	]
}
