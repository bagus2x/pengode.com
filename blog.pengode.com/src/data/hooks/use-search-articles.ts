import getArticles from '@pengode/blog/data/api/get-articles'
import Article from '@pengode/blog/data/models/article'
import { Paging } from '@pengode/blog/data/models/paging'
import { useInfiniteQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

const useSearchArticles = (
	initialArticles: Paging<Article>,
	delay: number = 500
) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()
	const [params, setParams] = useState<{
		search: string | null
		tags: string[]
	}>({
		search: searchParams.get('search'),
		tags: searchParams.getAll('tags'),
	})
	const [debouncedParams] = useDebounce(params, delay)

	const query = useInfiniteQuery<Paging<Article>, Error>({
		queryKey: ['articles', debouncedParams.search, debouncedParams.tags],
		queryFn: ({ pageParam = initialArticles.pagination.page || 1 }) => {
			return getArticles(
				pageParam,
				initialArticles.pagination.pageSize,
				debouncedParams.search
			)
		},
		getNextPageParam: (lastPage) => {
			return lastPage.pagination.page !== lastPage.pagination.pageCount
				? lastPage.pagination.page + 1
				: undefined
		},
		initialData: () => {
			if (initialArticles) {
				return {
					pages: [initialArticles],
					pageParams: [initialArticles.pagination.page],
				}
			}
		},
	})

	useEffect(() => {
		router.replace(
			pathname + '?' + qs.stringify(debouncedParams, { skipNulls: true })
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedParams])

	return {
		params,
		setParams,
		...query,
	}
}

export default useSearchArticles
