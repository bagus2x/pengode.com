'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

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
  useCreateProductCategoryMutation,
  useGetProductCategoriesQuery,
} from '@pengode/data/product-category/product-category-hook'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  name: z.string().min(1).max(16),
})

export type NewCategoryDialogProps = PropsWithClassName & {
  renderButton: React.ReactNode
}

export const NewCategoryDialog = ({
  className,
  renderButton,
}: NewCategoryDialogProps) => {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })
  const queryClient = useQueryClient()
  const createCategoryMutation = useCreateProductCategoryMutation()

  const handleSubmit = (req: z.infer<typeof formSchema>) => {
    createCategoryMutation.mutate(req, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: useGetProductCategoriesQuery.key().splice(0, 1),
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
      <DialogTrigger asChild>{renderButton}</DialogTrigger>
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
            </DialogHeader>
            <div className='py-4'>
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
