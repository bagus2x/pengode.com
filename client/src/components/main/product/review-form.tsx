'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { forwardRef, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'
import { toast } from 'sonner'
import * as z from 'zod'

import { errorMessages } from '@pengode/common/axios'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Button } from '@pengode/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@pengode/components/ui/form'
import { RatingBar } from '@pengode/components/ui/rating-bar'
import {
  useCreateProductReviewMutationQuery,
  useGetProductReviewByAuthUserAndProductQuery,
} from '@pengode/data/product-review/product-review-hook'

const Editor = dynamic(
  () =>
    import('@pengode/components/main/product/review-editor').then(
      (components) => components.ReviewEditor,
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

const ForwardedEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
)
ForwardedEditor.displayName = 'ForwardedEditor'

export type ReviewFormProps = PropsWithClassName & {
  productId: number
}

const formSchema = z.object({
  description: z.string().max(1023).nullable(),
  star: z.number().min(1, { message: 'rating must be selected' }).max(5),
})

export const ReviewForm = ({ className, productId }: ReviewFormProps) => {
  const editorRef = useRef<MDXEditorMethods>(null)
  const queryClient = useQueryClient()
  const { data: review } = useGetProductReviewByAuthUserAndProductQuery({
    productId,
  })
  const createReviewMutation = useCreateProductReviewMutationQuery()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: review?.description || '',
      star: review?.star,
    },
  })
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    form.setValue('star', review?.star || 0)
    editorRef.current?.setMarkdown(review?.description || '')
  }, [form, review?.description, review?.star])

  const handleCreateReview = (req: z.infer<typeof formSchema>) => {
    createReviewMutation.mutate(
      { ...req, productId },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ['GET_PRODUCT', productId],
            }),
            queryClient.invalidateQueries({
              queryKey: [
                'GET_PRODUCT_REVIEW_BY_AUTH_USER_AND_PRODUCT_ID',
                productId,
              ],
            }),
          ])

          toast.success('Review has been saved')
        },
        onError: (err) => {
          errorMessages(err).forEach((message) => {
            toast.error(message)
          })
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col', className)}
        onSubmit={form.handleSubmit(handleCreateReview)}>
        <FormField
          control={form.control}
          name='description'
          render={({ field: { value, ref, ...field } }) => (
            <FormItem className='mb-4'>
              <FormControl>
                <ForwardedEditor
                  className={cn(
                    'max-w-full rounded-2xl border border-border [&_[role=combobox]]:rounded-sm [&_[role=combobox]]:bg-background [&_[role=toolbar]]:rounded-xl [&_[role=toolbar]]:bg-muted [&_[role=toolbar]]:text-muted-foreground dark:[&_[role=toolbar]]:bg-muted/50 [&_button[data-state=on]]:bg-background [&_option]:!bg-background [&_select]:!bg-background',
                    resolvedTheme === 'dark' && 'dark-theme dark-editor',
                  )}
                  contentEditableClassName='prose dark:prose-invert max-w-full'
                  ref={mergeRefs([ref, editorRef])}
                  markdown={value || ''}
                  placeholder='Describe your articles...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='star'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RatingBar itemClassName='text-yellow-400' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            size='sm'
            className='min-w-40 self-end'
            disabled={createReviewMutation.isPending}>
            {createReviewMutation.isPending && (
              <Loader2Icon size={16} className='me-2 animate-spin' />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
