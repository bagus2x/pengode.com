'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import React, { forwardRef, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'
import { toast } from 'sonner'
import * as z from 'zod'

import { errorMessages } from '@pengode/common/axios'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Button } from '@pengode/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@pengode/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pengode/components/ui/form'
import { Input } from '@pengode/components/ui/input'
import { useCreateProductLogMutation } from '@pengode/data/product-log/product-log-hook'

const Editor = dynamic(
  () =>
    import('@pengode/components/dashboard/product/log-editor').then(
      (components) => components.ProductEditor,
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

export const formSchema = z.object({
  name: z.string().max(255),
  productUrl: z.string().url(),
  description: z.string(),
})

export type NewCategoryDialogProps = PropsWithClassName & {
  productId?: number
  logId?: number
  renderButton: React.ReactNode
}

export const NewLogDialog = ({
  className,
  productId,
  renderButton,
}: NewCategoryDialogProps) => {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      productUrl: '',
    },
  })
  const queryClient = useQueryClient()
  const createProductLogMutation = useCreateProductLogMutation()
  const { resolvedTheme } = useTheme()
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleSubmit = (req: z.infer<typeof formSchema>) => {
    if (!productId) return

    createProductLogMutation.mutate(
      { ...req, productId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['GET_PRODUCT', productId],
          })
          setOpen(false)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderButton}</DialogTrigger>
      <DialogContent className={cn('sm:max-w-screen-md', className)}>
        <Form {...form}>
          <form
            onSubmit={(ev) => {
              ev.stopPropagation()
              form.handleSubmit(handleSubmit)(ev)
            }}
            className='w-full min-w-0'>
            <DialogHeader className='mb-4'>
              <DialogTitle>Add new log</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='React.js' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field: { value, ref, ...field } }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <ForwardedEditor
                      className={cn(
                        'max-w-full rounded-2xl border [&_[role=combobox]]:rounded-sm [&_[role=combobox]]:bg-background [&_[role=toolbar]]:rounded-xl [&_[role=toolbar]]:bg-muted [&_[role=toolbar]]:text-muted-foreground dark:[&_[role=toolbar]]:bg-muted/50 [&_button[data-state=on]]:bg-background [&_option]:!bg-background [&_select]:!bg-background',
                        resolvedTheme === 'dark' && 'dark-theme dark-editor',
                        '[&_[role=toolbar]]:scrollbar [&_[role=toolbar]]:scrollbar-track-secondary [&_[role=toolbar]]:scrollbar-thumb-transparent [&_[role=toolbar]]:scrollbar-thumb-rounded-2xl [&_[role=toolbar]]:scrollbar-w-2 [&_[role=toolbar]]:scrollbar-h-2 [&_[role=toolbar]]:hover:scrollbar-thumb-primary/20',
                      )}
                      contentEditableClassName='prose dark:prose-invert max-w-full'
                      ref={mergeRefs([ref, editorRef])}
                      diffMarkdown={''}
                      markdown={value}
                      placeholder='Describe your product...'
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='productUrl'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Product url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Product url to be downloaded by customer'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit'>Save category</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
