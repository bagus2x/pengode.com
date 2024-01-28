'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2Icon, PlusCircleIcon, PlusIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { forwardRef, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'
import { toast } from 'sonner'
import * as z from 'zod'
import ReactMarkdown from 'react-markdown'

import { restErrorMessages } from '@pengode/common/rest-client'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { NewCategoryDialog } from '@pengode/components/dashboard/product/new-category-dialog'
import { NewLogDialog } from '@pengode/components/dashboard/product/new-log-dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@pengode/components/ui/accordion'
import { useBlockUi } from '@pengode/components/ui/block-ui'
import { Button } from '@pengode/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@pengode/components/ui/card'
import { MultiSelect } from '@pengode/components/ui/combobox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pengode/components/ui/form'
import { ImageUploader } from '@pengode/components/ui/image-uploader'
import { Input } from '@pengode/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pengode/components/ui/select'
import { upload } from '@pengode/data/cloudinary'
import { createProduct, getProduct, updateProduct } from '@pengode/data/product'
import { getCategories } from '@pengode/data/product-category'
import Link from 'next/link'
import { Badge } from '@pengode/components/ui/badge'

const formSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  preview: z
    .instanceof(File, { message: 'not valid file' })
    .or(z.string().url()),
  price: z
    .string()
    .regex(/^\d{1,10}(\.\d{1,4})?$/, { message: 'Invalid price' }),
  discount: z.coerce.number().min(0).max(100),
  status: z.enum(['VISIBLE', 'INVISIBLE']),
  categoryIds: z.array(z.coerce.number().positive()),
})

const Editor = dynamic(
  () =>
    import('@pengode/components/dashboard/product/product-editor').then(
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

export const ProductForm = ({ className }: PropsWithClassName) => {
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
    ? parseInt(searchParams.get('id')!)
    : null
  const editMode = !!productId
  const { data: product, ...getProductQUery } = useQuery({
    queryKey: ['GET_PRODUCT', productId],
    queryFn: async () => {
      if (productId) return await getProduct(productId)
    },
    enabled: editMode,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      preview: '',
      price: '0',
      discount: 0,
      status: 'VISIBLE',
      categoryIds: [],
    },
  })
  const { resolvedTheme } = useTheme()
  const editorRef = useRef<MDXEditorMethods>(null)
  const { data: categories, ...getCategoriesQuery } = useQuery({
    queryKey: ['GET_PRODUCT_CATEGORIES'],
    queryFn: async () => await getCategories({ size: 100 }),
  })
  const blockUi = useBlockUi()
  const createProductMutation = useMutation({
    mutationFn: async ({ preview, ...req }: z.infer<typeof formSchema>) => {
      if (preview instanceof File) {
        const formData = new FormData()
        formData.append('file', preview)
        const result = await upload(formData)

        if (editMode && productId) {
          return await updateProduct(productId, {
            ...req,
            discount: req.discount / 100,
            previewUrl: result['secure_url'],
          })
        } else {
          return await createProduct({
            ...req,
            discount: req.discount / 100,
            previewUrl: result['secure_url'],
          })
        }
      }

      if (editMode && productId) {
        return await updateProduct(productId, {
          ...req,
          discount: req.discount / 100,
          previewUrl: preview,
        })
      }

      return await createProduct({
        ...req,
        discount: req.discount / 100,
        previewUrl: preview,
      })
    },
    mutationKey: ['CREATE_OR_UPDATE_PRODUCT', editMode],
  })
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (getProductQUery.isLoading) blockUi.block()
    else blockUi.unblock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProductQUery.isLoading])

  useEffect(() => {
    if (getProductQUery.isFetched && product) {
      form.setValue('title', product.title)
      form.setValue('description', product.description)
      form.setValue('preview', product.previewUrl)
      form.setValue('price', product.price)
      form.setValue('discount', product.discount ? product.discount * 100 : 0)
      const categoryIds = product.categories.map((category) => category.id)
      form.setValue('categoryIds', categoryIds)
      editorRef.current?.setMarkdown(product.description)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, getProductQUery.isFetched, editorRef])

  const handleSave = (req: z.infer<typeof formSchema>) => {
    createProductMutation.mutate(req, {
      onSuccess: (product) => {
        getProductQUery.refetch()
        toast.success('Product successfully saved')

        const params = new URLSearchParams(searchParams.toString())
        params.set('id', `${product.id}`)
        router.replace(`${pathname}?${params.toString()}`)
      },
      onError: (err) => {
        restErrorMessages(err).forEach((message) => {
          toast.error(message)
        })
      },
    })
  }

  return (
    <section
      className={cn(
        'mx-auto flex w-full max-w-screen-xl flex-col gap-4 lg:flex-row lg:items-start',
        className,
      )}>
      <Card className='flex-1'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardHeader>
              <CardTitle>Product</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='React Dashboard' {...field} />
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
                name='preview'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Preview</FormLabel>
                    <FormControl>
                      <ImageUploader
                        multiple={false}
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
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                        <span>Rp.&nbsp;</span>
                        <input
                          {...field}
                          type='number'
                          className='w-full bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='discount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a discount' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>0%</SelectItem>
                        <SelectItem value='10'>10%</SelectItem>
                        <SelectItem value='40'>40%</SelectItem>
                        <SelectItem value='60'>60%</SelectItem>
                        <SelectItem value='80'>80%</SelectItem>
                        <SelectItem value='90'>90%</SelectItem>
                        <SelectItem value='100%'>100%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='VISIBLE'>Visible</SelectItem>
                        <SelectItem value='INVISIBLE'>Invisible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Product with status visible will allow user to access it
                    </FormDescription>
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
                      <NewCategoryDialog
                        renderButton={
                          <button>
                            <PlusCircleIcon className='h-4 w-4' />
                          </button>
                        }
                      />
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder='Select categories'
                        options={
                          categories?.items.map((category) => ({
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
              <Button type='submit' disabled={createProductMutation.isPending}>
                {createProductMutation.isPending && (
                  <Loader2Icon className='me-2 h-4 w-4 animate-spin' />
                )}
                Save
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-start justify-between gap-4'>
            <CardTitle>Log Releases</CardTitle>
            <NewLogDialog
              productId={product?.id}
              renderButton={
                <Button size='sm' disabled={!product}>
                  <PlusIcon className='me-2 h-4 w-4' /> Add
                </Button>
              }
            />
          </div>
          <CardDescription>
            Allow customer to see product versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>{!product?.logs && 'No Release Available'}</div>
          <Accordion type='single' collapsible className='w-full'>
            {product?.logs?.map((log) => (
              <AccordionItem key={log.id} value={`${log.id}`} className='group'>
                <AccordionTrigger>
                  <div className='me-4 flex w-full justify-between'>
                    {log.name}{' '}
                    <Badge
                      variant='secondary'
                      className='opacity-0 transition-all duration-500 group-hover:opacity-100'>
                      <Link href={log.productUrl} className='no-underline'>
                        URL
                      </Link>
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ReactMarkdown className='prose mx-auto mb-4 w-full max-w-screen-xl'>
                    {log.description}
                  </ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
