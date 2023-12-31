'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Google as GoogleIcon } from 'iconsax-react'
import { GithubIcon } from 'lucide-react'

import { Button } from '@pengode/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@pengode/components/ui/form'
import { Input } from '@pengode/components/ui/input'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(4),
})

export function SignUpForm({ className }: PropsWithClassName) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('flex flex-col gap-4', className)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='mb-2'>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='mb-2'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='john@mail.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='mb-2'>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='john' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='mb-2'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='●●●●●●●●●●●' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Sign up</Button>
        <div className='relative mb-4 flex justify-center'>
          <div className='absolute inset-0 -z-10 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <span className='mx-auto bg-background px-2 text-sm uppercase text-muted-foreground'>
            Or continue with
          </span>
        </div>
        <Button type='button' variant='outline' className='mb-2'>
          <GoogleIcon className='me-2' />
          Google
        </Button>
        <Button type='button' variant='outline'>
          <GithubIcon className='me-2' />
          GitHub
        </Button>
      </form>
    </Form>
  )
}
