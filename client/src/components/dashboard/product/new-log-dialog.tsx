'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircleIcon } from 'lucide-react'
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
import { createCategory } from '@pengode/data/product-category'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLog } from '@pengode/data/product-log'
import { Textarea } from '@pengode/components/ui/textarea'

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
  const createLogMutation = useMutation({ mutationFn: createLog })

  const handleSubmit = (req: z.infer<typeof formSchema>) => {
    if (!productId) return

    createLogMutation.mutate(
      { ...req, productId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['GET_PRODUCT_LOGS', productId],
          })
          setOpen(false)
        },
        onError: (err) => {
          err.message.split(', ').forEach((message) => {
            toast.error(message)
          })
        },
      },
    )
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
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Put log description here'
                        {...field}
                      />
                    </FormControl>
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
