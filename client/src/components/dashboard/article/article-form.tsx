'use client'

import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { forwardRef, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'
import { toast } from 'sonner'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { createArticle, getArticle, updateArticle } from '@pengode/data/article'
import { getCategories } from '@pengode/data/article-category'
import { upload } from '@pengode/data/cloudinary'
import { useRouter, useSearchParams } from 'next/navigation'

const Editor = dynamic(
  () =>
    import('@pengode/components/dashboard/article/article-editor').then(
      (components) => components.PostEditor,
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
  thumbnail: z.instanceof(File).or(z.string()).nullable(),
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
    : null
  const editMode = !!articleId
  const { data: article, ...getArticleQuery } = useQuery({
    queryKey: ['GET_ARTICLE', articleId],
    queryFn: async () => {
      if (articleId) return await getArticle(articleId)
    },
    enabled: editMode,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      summary: '',
      thumbnail: null,
      body: '',
      categoryIds: [],
    },
  })
  const { resolvedTheme } = useTheme()
  const { data: categories } = useQuery({
    queryKey: ['GET_CATEGORIES'],
    queryFn: async () => await getCategories(),
  })
  const createArticleMutation = useMutation({
    mutationFn: async ({ thumbnail, ...req }: z.infer<typeof formSchema>) => {
      if (thumbnail instanceof File) {
        const formData = new FormData()
        formData.append('file', thumbnail)
        const result = await upload(formData)

        if (editMode && articleId) {
          return await updateArticle(articleId, {
            ...req,
            thumbnail: result['secure_url'],
          })
        } else {
          return await createArticle({
            ...req,
            thumbnail: result['secure_url'],
          })
        }
      }

      if (editMode && articleId) return await updateArticle(articleId, req)
      else return await createArticle(req)
    },
    mutationKey: ['ARTICLE_EDITOR', editMode],
  })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getArticleQuery.isLoading])

  useEffect(() => {
    if (getArticleQuery.isFetched && article) {
      form.setValue('title', article.title)
      form.setValue('body', article.body)
      form.setValue('summary', article.summary)
      form.setValue('body', article.body)
      const categoryIds = article.categories.map((category) => category.id)
      form.setValue('categoryIds', categoryIds)
      form.setValue('thumbnail', article.thumbnail || null)
      editorRef.current?.setMarkdown(article.body)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, getArticleQuery.isFetched, editorRef])

  const handleSave = (req: z.infer<typeof formSchema>) => {
    createArticleMutation.mutate(req, {
      onSuccess: () => {
        getArticleQuery.refetch()
        toast.success('Articles successfully saved')
        router.replace('/dashboard/article')
      },
      onError: (err) => {
        err.message.split(', ').forEach((message) => {
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
                          categories?.map((category) => ({
                            label: category.name,
                            value: `${category.id}`,
                          })) || []
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
                disabled={createArticleMutation.isPending}>
                {createArticleMutation.isPending && (
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
