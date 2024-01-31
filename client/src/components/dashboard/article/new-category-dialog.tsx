'use client'

import { PlusCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@pengode/components/ui/select'
import { useCreateProductCategoryMutation } from '@pengode/data/product-category/product-category-hook'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useGetArticleCategoriesQuery } from '@pengode/data/article-category/article-category-hook'

const colors = [
  { name: 'Slate', value: '#64748b' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#84cc16' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Pink', value: '#ec4899' },
]

const formSchema = z.object({
  name: z.string().min(1).max(16),
  color: z.string().length(7),
})

export const NewCategoryDialog = ({ className }: PropsWithClassName) => {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: colors[0].value,
    },
  })
  const queryClient = useQueryClient()
  const createCategoryMutation = useCreateProductCategoryMutation()

  const handleSubmit = (req: z.infer<typeof formSchema>) => {
    createCategoryMutation.mutate(req, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: useGetArticleCategoriesQuery.key().slice(0, 1),
        })
        setOpen(false)
      },
      onError: (err) => {
        err.message.split(', ').forEach((message) => {
          toast.error(message)
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>
          <PlusCircleIcon className='h-4 w-4' />
        </button>
      </DialogTrigger>
      <DialogContent className={cn('sm:max-w-sm', className)}>
        <Form {...form}>
          <form
            onSubmit={(ev) => {
              ev.stopPropagation()
              form.handleSubmit(handleSubmit)(ev)
            }}
            className='w-full'>
            <DialogHeader>
              <DialogTitle>Add new category</DialogTitle>
              <DialogDescription>
                Create a new category to make articles more organized
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Web Developments' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Colors</SelectLabel>
                            {colors.map((color) => (
                              <SelectItem
                                key={color.value}
                                value={color.value}
                                className='flex items-center gap-2'>
                                <span
                                  className='me-2 mt-2 inline-block h-3 w-3 shrink-0 rounded-full'
                                  style={{
                                    backgroundColor: color.value,
                                  }}></span>
                                {color.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
