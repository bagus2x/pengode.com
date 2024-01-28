'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
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
    if (!session.data) return

    if (callbackUrl) {
      router.replace(callbackUrl)
    } else {
      const isAdmin = session.data.user.roles.some(
        (role) => role.name === 'ADMIN',
      )
      if (isAdmin) router.replace('/dashboard')
      else router.replace('/')
    }
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='●●●●●●●●●●●' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={signInMutation.isPending}>
          {signInMutation.isPending && (
            <Loader2Icon size={16} className='me-2 animate-spin' />
          )}
          Sign in
        </Button>
        <Link href='/signup' className='text-end text-xs text-muted-foreground'>
          Don&lsquo;t have an account? <strong>Sign up</strong>
        </Link>
        <div className='relative flex justify-center'>
          <div className='absolute inset-0 -z-10 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <span className='mx-auto bg-background px-2 text-sm uppercase text-muted-foreground'>
            Or continue with
          </span>
        </div>
        <Button
          disabled={signInMutation.isPending}
          type='button'
          variant='outline'
          onClick={handleSignInWithGoogle}>
          <Image
            src={'/assets/google.svg'}
            width={24}
            height={24}
            alt='Google sign in'
            className='me-2'
          />
          Google
        </Button>
        <Button
          disabled={signInMutation.isPending}
          type='button'
          variant='outline'
          onClick={handleSignInWithGithub}>
          <Image
            src={'/assets/github.svg'}
            width={24}
            height={24}
            alt='Github sign in'
            className='me-2'
          />
          GitHub
        </Button>
      </form>
    </Form>
  )
}
