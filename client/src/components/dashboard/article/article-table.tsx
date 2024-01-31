'use client'

import dayjs from 'dayjs'
import { useInView } from 'framer-motion'
import {
  CalendarClockIcon,
  EditIcon,
  InfoIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  SendIcon,
  TrashIcon,
  UndoDotIcon,
  UndoIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { avatar } from '@pengode/common/utils'
import { ArticleInfoDialog } from '@pengode/components/dashboard/article/article-info-dialog'
import { ArticleSchedulerDialog } from '@pengode/components/dashboard/article/article-scheduler-dialog'
import { TableToolbar } from '@pengode/components/dashboard/article/table-toolbar'
import { Badge } from '@pengode/components/ui/badge'
import { useBlockUi } from '@pengode/components/ui/block-ui'
import { Card } from '@pengode/components/ui/card'
import { useConfirmation } from '@pengode/components/ui/confirmation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pengode/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@pengode/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@pengode/components/ui/table'
import { Article } from '@pengode/data/article/article'
import {
  useDeleteArticleMutation,
  useDraftArticleMutation,
  useGetArticlesQuery,
  usePublishArticleMutation,
  useRestoreArticleMutation,
  useScheduleArticleMutation,
} from '@pengode/data/article/article-hook'

export const ArticleTable = ({ className }: PropsWithClassName) => {
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<Article['status'][]>(
    ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'DELETED'],
  )
  const { data: articlePages, ...getArticlesQuery } = useGetArticlesQuery({
    size,
    search,
  })
  const draftArticleMutation = useDraftArticleMutation()
  const scheduleArticleMutation = useScheduleArticleMutation()
  const publishArticleMutation = usePublishArticleMutation()
  const deleteArticleMutation = useDeleteArticleMutation()
  const restoreArticleMutation = useRestoreArticleMutation()
  const blockUi = useBlockUi()
  const [scheduledArticle, setScheduledArticle] = useState<Article | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const { confirm, ConfirmationDialog } = useConfirmation()
  const loaderRef = useRef<HTMLDivElement>(null)
  const inView = useInView(loaderRef)

  useEffect(() => {
    if (inView && getArticlesQuery.hasNextPage) getArticlesQuery.fetchNextPage()
  }, [inView, getArticlesQuery])

  const handleDraftArticle = (article: Article) => () => {
    confirm({
      title: 'Are you sure to draft article?',
      description:
        'This article will not be able to be accessed by common readers',
      onConfirm: () => {
        blockUi.block()

        draftArticleMutation.mutate(article.id, {
          onSuccess: (article) => {
            toast.success(`${article.title} drafted`)
            getArticlesQuery.refetch()
          },
          onError: (err) => {
            err.message.split(', ').forEach((message) => {
              toast.error(message)
            })
          },
          onSettled: blockUi.unblock,
        })
      },
    })
  }

  const handleScheduleArticle = (article: Article, time: Date) => {
    blockUi.block()

    scheduleArticleMutation.mutate(
      { articleId: article.id, req: { time: time.getTime() } },
      {
        onSuccess: (article) => {
          toast.success(
            `${article.title} scheduled at ${dayjs(time).format(
              'DD MM YY HH:MM',
            )}`,
          )
          getArticlesQuery.refetch()
        },
        onError: (err) => {
          err.message.split(', ').forEach((message) => {
            toast.error(message)
          })
        },
        onSettled: blockUi.unblock,
      },
    )
  }

  const handlePublishArticle = (article: Article) => () => {
    confirm({
      title: 'Are you sure to publish article?',
      description: 'This article will be able to be accessed by all readers',
      onConfirm: () => {
        blockUi.block()

        publishArticleMutation.mutate(article.id, {
          onSuccess: (article) => {
            toast.success(`${article.title} published`)
            getArticlesQuery.refetch()
          },
          onError: (err) => {
            err.message.split(', ').forEach((message) => {
              toast.error(message)
            })
          },
          onSettled: blockUi.unblock,
        })
      },
    })
  }

  const handleDeleteArticle = (article: Article) => () => {
    confirm({
      title:
        article.status === 'DELETED'
          ? `Are you sure to delete "${article.title}" permanently?`
          : `Are you sure to delete ${article.title}?`,
      description:
        article.status === 'DELETED'
          ? 'This article will be deleted permanently'
          : 'This article will be deleted permanently after 30 Days',
      onConfirm: () => {
        blockUi.block()

        deleteArticleMutation.mutate(
          {
            articleId: article.id,
            permanent: article.status === 'DELETED',
          },
          {
            onSuccess: (article) => {
              toast.success(`${article.title} deleted`)
              getArticlesQuery.refetch()
            },
            onError: (err) => {
              err.message.split(', ').forEach((message) => {
                toast.error(message)
              })
            },
            onSettled: blockUi.unblock,
          },
        )
      },
    })
  }

  const handleRestoreArticle = (article: Article) => () => {
    confirm({
      title: 'Are you sure to restore article?',
      description: 'This article will be set to draft mode',
      onConfirm: () => {
        blockUi.block()

        restoreArticleMutation.mutate(article.id, {
          onSuccess: (article) => {
            toast.success(`${article.title} restored`)
            getArticlesQuery.refetch()
          },
          onError: (err) => {
            err.message.split(', ').forEach((message) => {
              toast.error(message)
            })
          },
          onSettled: blockUi.unblock,
        })
      },
    })
  }

  return (
    <>
      <section className={cn('relative mx-auto max-w-screen-xl', className)}>
        <Card className='py-4'>
          <TableToolbar
            search={search}
            onSearch={setSearch}
            className='mb-4 px-4'
            selectedStatuses={selectedStatuses}
            onChangeStatuses={setSelectedStatuses}
          />
          <ScrollArea>
            <Table className='mb-4'>
              <TableHeader className='border-t border-t-border'>
                <TableRow>
                  <TableHead className='w-[120px]'>Author</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className='w-[140px]'>Created At</TableHead>
                  <TableHead className='w-[40px] text-right'> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='border-b border-b-border'>
                {articlePages?.pages.map((page) =>
                  page.items.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className='w-28 font-medium'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src={avatar(
                              article.author.name,
                              article.author.photo,
                            )}
                            width={20}
                            height={20}
                            alt={article.author.name}
                            className='shrink-0 rounded-full transition hover:scale-105'
                          />
                          <span className='flex-1 truncate'>
                            {article.author.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-xs truncate'>
                        <Badge
                          className={cn(
                            'me-2',
                            article.status === 'DRAFT' &&
                              'bg-indigo-100 text-indigo-500 hover:bg-indigo-100',
                            article.status === 'SCHEDULED' &&
                              'bg-orange-100 text-orange-500 hover:bg-orange-100',
                            article.status === 'PUBLISHED' &&
                              'bg-green-100 text-green-500 hover:bg-green-100',
                            article.status === 'DELETED' &&
                              'bg-red-100 text-red-500 hover:bg-red-100',
                          )}>
                          {article.status.toLowerCase()}
                        </Badge>
                        {article.title}
                      </TableCell>
                      <TableCell className='max-w-xs truncate'>
                        {article.summary}
                      </TableCell>
                      <TableCell className='text-sm'>
                        {dayjs(new Date(article.createdAt)).format(
                          'DD MMM YY HH:MM',
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className='grid w-full place-items-center'>
                              <MoreHorizontalIcon className='h-4 w-4' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSelectedArticle(article)}>
                              <InfoIcon className='me-2 h-4 w-4' />
                              Info
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={handlePublishArticle(article)}
                              disabled={article.status !== 'DRAFT'}>
                              <SendIcon className='me-2 h-4 w-4' />
                              Publish
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setScheduledArticle(article)}
                              disabled={article.status !== 'DRAFT'}>
                              <CalendarClockIcon className='me-2 h-4 w-4' />
                              Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={handleDraftArticle(article)}
                              disabled={
                                article.status !== 'PUBLISHED' &&
                                article.status !== 'SCHEDULED'
                              }>
                              <UndoIcon className='me-2 h-4 w-4' />
                              Draft
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={handleDeleteArticle(article)}>
                              <TrashIcon className='me-2 h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={handleRestoreArticle(article)}
                              disabled={article.status !== 'DELETED'}>
                              <UndoDotIcon className='me-2 h-4 w-4' />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/article/editor?id=${article.id}`}>
                                <EditIcon className='me-2 h-4 w-4' />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
          <div className='relative flex w-full flex-col items-center justify-center'>
            <div
              ref={loaderRef}
              className='absolute left-1/2 top-1/2 mt-14 -translate-x-1/2 -translate-y-1/2 transform'>
              <Loader2Icon
                className={cn(
                  'animate-spin',
                  !getArticlesQuery.isFetching && 'hidden',
                )}
              />
            </div>
          </div>
        </Card>
      </section>
      <ConfirmationDialog />
      <ArticleInfoDialog
        article={selectedArticle}
        open={!!selectedArticle}
        onChangeOpen={(open) => {
          if (!open) setSelectedArticle(null)
        }}
      />
      <ArticleSchedulerDialog
        article={scheduledArticle}
        open={!!scheduledArticle}
        onChangeOpen={(open) => {
          if (!open) setScheduledArticle(null)
        }}
        onSchedule={handleScheduleArticle}
      />
    </>
  )
}
