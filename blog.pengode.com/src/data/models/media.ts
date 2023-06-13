export default interface Media {
	id: number
	name: string
	url: string
	mime: string
	ext: string
	alternativeText?: string
	caption?: string
	width: number
	height: number
	size: number
	formats?: {
		thumbnail?: {
			url: string
			name: string
			mime: string
			ext: string
			width: number
			height: number
			size: number
		}
		large?: {
			url: string
			name: string
			ext: string
			mime: string
			width: number
			height: number
			size: number
		}
		medium?: {
			url: string
			name: string
			ext: string
			mime: string
			width: number
			height: number
			size: number
		}
		small?: {
			url: string
			name: string
			ext: string
			mime: string
			width: number
			height: number
			size: number
		}
	}
}
