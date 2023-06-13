import Media from '@pengode/blog/data/models/media'
import Profile from '@pengode/blog/data/models/profile'
import Tag from '@pengode/blog/data/models/tag'

export default interface Article {
	id: number
	title: string
	body: string
	summary: string
	thumbnail: Media
	author?: Profile
	tags: Tag[]
	createdAt: Date
	updatedAt: Date
}
