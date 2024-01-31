'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import { Loader2Icon } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { forwardRef, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'
import { toast } from 'sonner'
import * as z from 'zod'

import { errorMessages } from '@pengode/common/axios'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { NewCategoryDialog } from '@pengode/components/dashboard/article/new-category-dialog'
import { useBlockUi } from '@pengode/components/ui/block-ui'
import { Button } from '@pengode/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@pengode/components/ui/card'
import { MultiSelect } from '@pengode/components/ui/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pengode/components/ui/form'
import { ImageUploader } from '@pengode/components/ui/image-uploader'
import { Input } from '@pengode/components/ui/input'
import { Textarea } from '@pengode/components/ui/textarea'
import { useGetArticleCategoriesQuery } from '@pengode/data/article-category/article-category-hook'
import {
  useGetArticleQuery,
  useUpsertArticleMutation,
} from '@pengode/data/article/article-hook'

const Editor = dynamic(
  () =>
    import('@pengode/components/dashboard/article/article-editor').then(
      (components) => components.ArticleEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className='grid w-full place-items-center p-4'>
        <Loader2Icon className='animate-spin' />
      </div>
    ),
  },
)

const ForwardedEditor = forwardRef<
  MDXEditorMethods,
  MDXEditorProps & { diffMarkdown: string }
>((props, ref) => <Editor {...props} editorRef={ref} />)

ForwardedEditor.displayName = 'ForwardedEditor'

const formSchema = z.object({
  title: z
    .string()
    .min(0, {
      message: 'Title must be at least 4 characters.',
    })
    .max(255, {
      message: 'Title must be less than 255 characters.',
    }),
  summary: z
    .string()
    .min(0, {
      message: 'Summary must be at least 20 characters.',
    })
    .max(511, {
      message: 'Summary must be less than 511 characters.',
    }),
  readingTime: z.number().optional(),
  thumbnail: z.instanceof(File).or(z.string()),
  categoryIds: z
    .array(z.number().gt(0))
    .min(0, { message: 'Choose at least one category' }),
  body: z.string().min(0, {
    message: 'Body must be at least 20 characters.',
  }),
})

export const ArticleForm = ({ className }: PropsWithClassName) => {
  const editorRef = useRef<MDXEditorMethods>(null)
  const searchParams = useSearchParams()
  const articleId = searchParams.get('id')
    ? parseInt(searchParams.get('id')!)
    : undefined
  const editMode = !!articleId
  const { data: article, ...getArticleQuery } = useGetArticleQuery({
    articleId,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      summary: '',
      readingTime: 0,
      thumbnail: '',
      body: '',
      categoryIds: [],
    },
  })
  const { resolvedTheme } = useTheme()
  const { data: articleCategoryPages } = useGetArticleCategoriesQuery()
  const upsertArticleMutation = useUpsertArticleMutation({ articleId })
  const router = useRouter()
  const blockUi = useBlockUi()

  useEffect(() => {
    if (form.formState.errors.body) {
      toast.error(form.formState.errors.body.message)
    }
  }, [form.formState.errors.body])

  useEffect(() => {
    if (getArticleQuery.isLoading) blockUi.block()
    else blockUi.unblock()

    return blockUi.unblock

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getArticleQuery.isLoading])

  useEffect(() => {
    if (getArticleQuery.isFetched && article) {
      form.setValue('title', article.title)
      form.setValue('body', article.body)
      form.setValue('summary', article.summary)
      form.setValue('readingTime', article.readingTime || 0)
      form.setValue('body', article.body)
      const categoryIds = article.categories.map((category) => category.id)
      form.setValue('categoryIds', categoryIds)
      form.setValue('thumbnail', article.thumbnail || '')
      editorRef.current?.setMarkdown(article.body)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, getArticleQuery.isFetched, editorRef])

  const handleSave = (req: z.infer<typeof formSchema>) => {
    upsertArticleMutation.mutate(req, {
      onSuccess: () => {
        getArticleQuery.refetch()
        toast.success('Articles successfully saved')
        router.replace('/dashboard/article')
      },
      onError: (err) => {
        errorMessages(err).forEach((message) => {
          toast.error(message)
        })
      },
    })
  }

  return (
    <section
      className={cn(
        'relative mx-auto flex w-full max-w-screen-xl flex-col items-start gap-4',
        className,
      )}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className='flex w-full flex-col items-start gap-4 md:flex-row-reverse'>
          <Card className='w-full shrink-0 md:w-80'>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                Fill out the metadata for better user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Title of post' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='summary'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Summary of post' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='readingTime'
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Reading time in minutes</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Summary of post'
                        {...field}
                        onChange={(ev) => onChange(parseInt(ev.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='categoryIds'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel className='flex items-center gap-2'>
                      Categories
                      <NewCategoryDialog />
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={
                          articleCategoryPages?.pages
                            .map((page) =>
                              page.items?.map((category) => ({
                                label: category.name,
                                value: `${category.id}`,
                              })),
                            )
                            .flat() || []
                        }
                        values={new Set(field.value.map((v) => `${v}`))}
                        onChange={(values) => {
                          field.onChange(
                            [...Array.from(values)].map((v) => parseInt(v)),
                          )
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='thumbnail'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <ImageUploader
                        files={field.value ? [field.value] : []}
                        onChange={(files) => {
                          const file = files[0]
                          if (file) field.onChange(file)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='justify-end'>
              <Button
                type='submit'
                size='sm'
                disabled={upsertArticleMutation.isPending}>
                {upsertArticleMutation.isPending && (
                  <Loader2Icon className='me-2 h-4 w-4 animate-spin' />
                )}
                Save
              </Button>
            </CardFooter>
          </Card>
          <Card className='flex-1 p-4'>
            <FormField
              control={form.control}
              name='body'
              render={({ field: { value, ref, ...field } }) => (
                <ForwardedEditor
                  className={cn(
                    'max-w-full [&_[role=combobox]]:rounded-sm [&_[role=combobox]]:bg-background [&_[role=toolbar]]:rounded-xl [&_[role=toolbar]]:bg-muted [&_[role=toolbar]]:text-muted-foreground dark:[&_[role=toolbar]]:bg-muted/50 [&_button[data-state=on]]:bg-background [&_option]:!bg-background [&_select]:!bg-background',
                    resolvedTheme === 'dark' && 'dark-theme dark-editor',
                  )}
                  contentEditableClassName='prose dark:prose-invert max-w-full'
                  ref={mergeRefs([ref, editorRef])}
                  diffMarkdown={article?.body || ''}
                  markdown={value}
                  placeholder='Describe your articles...'
                  {...field}
                />
              )}
            />
          </Card>
        </form>
      </Form>
    </section>
  )
}
