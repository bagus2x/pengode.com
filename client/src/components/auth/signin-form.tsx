'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
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
import {
  signInWithCredentials,
  signInWithGithub,
  signInWithGoogle,
} from '@pengode/data/auth'
import { useEffect } from 'react'

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(4),
})

export function SignInForm({ className }: PropsWithClassName) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const signInMutation = useMutation({
    mutationFn: signInWithCredentials,
  })
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl')
  const session = useSession()

  useEffect(() => {
    if (!session) return

    if (callbackUrl) router.replace(callbackUrl)
    else router.replace('/dashboard')
  }, [callbackUrl, router, session])

  const handleSignInWithCredentials = (req: z.infer<typeof formSchema>) => {
    signInMutation.mutate(req, {
      onSuccess: async () => {
        toast.success('Signed in')
      },
      onError: (err) => {
        err.message.split(', ').forEach((message) => {
          toast.error(message)
        })
      },
    })
  }

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle({ callbackUrl })
  }

  const handleSignInWithGithub = async () => {
    await signInWithGithub({ callbackUrl })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignInWithCredentials)}
        className={cn('flex flex-col gap-4', className)}>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
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
            <FormItem className='mb-4'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='●●●●●●●●●●●' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={signInMutation.isPending}
          className='mt-4'>
          {signInMutation.isPending && (
            <Loader2Icon size={16} className='me-2 animate-spin' />
          )}
          Sign in
        </Button>
        <Button
          disabled={signInMutation.isPending}
          className='mt-4'
          type='button'
          variant='outline'
          onClick={handleSignInWithGoogle}>
          Google
        </Button>
        <Button
          disabled={signInMutation.isPending}
          className='mt-4'
          type='button'
          variant='outline'
          onClick={handleSignInWithGithub}>
          GitHub
        </Button>
      </form>
    </Form>
  )
}
