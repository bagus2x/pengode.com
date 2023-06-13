import Pagination from '@pengode/blog/data/models/pagination'

export interface Paging<T> {
	data: T[]
	pagination: Pagination
}
