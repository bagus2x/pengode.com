'use client'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ArticleItem } from '@pengode/components/article/article-item'
import { Separator } from '@pengode/components/ui/separator'
import { Article, getArticles } from '@pengode/data/article'
import { Page } from '@pengode/data/types'

export type ArticleListProps = PropsWithClassName & {
  articles?: Page<Article>
}

export function ArticleList({
  className,
  articles: initialArticles,
}: ArticleListProps) {
  const { data: articlePage } = useQuery({
    queryKey: ['GET_ARTICLES'],
    initialData: initialArticles,
    queryFn: async () => await getArticles({ page: 0, size: 20, search: '' }),
  })

  return (
    <section
      className={cn(
        'mx-auto flex max-w-screen-xl flex-col gap-8 p-4',
        className,
      )}>
      {articlePage?.data.map((article) => (
        <Fragment key={article.id}>
          <ArticleItem
            id={article.id}
            title={article.title}
            image='https://cdn.dribbble.com/userupload/11290935/file/original-f0f71be79f98dd54d2a386ace0a02093.png?resize=1600x1200'
            categories={article.categories.map((category) => category.name)}
            readTime={10}
            summary={article.summary}
            createdAt={new Date(article.createdAt)}
          />
          <Separator />
        </Fragment>
      ))}
    </section>
  )
}
