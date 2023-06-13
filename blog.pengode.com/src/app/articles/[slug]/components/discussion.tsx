'use client'

import Article from '@pengode/blog/data/models/article'
import { DiscussionEmbed } from 'disqus-react'

interface DiscussionProps {
	article: Article
}

export default function Discussion({ article }: DiscussionProps) {
	return (
		<DiscussionEmbed
			shortname='Pengode'
			config={{
				identifier: article.id.toString(),
				url: location.href,
				title: article.title,
			}}
		/>
	)
}
