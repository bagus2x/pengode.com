import { BASE_URL_BLOG } from '@pengode/blog/lib/utils'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/private/',
		},
		sitemap: `${BASE_URL_BLOG}/sitemap.xml`,
	}
}
