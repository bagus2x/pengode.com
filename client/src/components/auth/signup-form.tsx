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
import { signInWithGithub, signInWithGoogle, signUp } from '@pengode/data/auth'

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
  const signUpMutation = useMutation({ mutationFn: signUp })
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl')
  const session = useSession()

  useEffect(() => {
    if (!session.data) return
    router.replace('/')
  }, [router, session.data])

  const handleSignInUpCredentials = (req: z.infer<typeof formSchema>) => {
    signUpMutation.mutate(req, {
      onSuccess: async () => {
        toast.success('Signed up')
        router.replace('/signin')
      },
      onError: (err) => {
        err.message.split(', ').forEach((message) => {
          toast.error(message)
        })
      },
    })
  }

  const handleSignUpWithGoogle = async () => {
    await signInWithGoogle({ callbackUrl })
  }

  const handleSignUpWithGithub = async () => {
    await signInWithGithub({ callbackUrl })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignInUpCredentials)}
        className={cn('flex flex-col gap-4', className)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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
        <Button type='submit' disabled={signUpMutation.isPending}>
          {signUpMutation.isPending && (
            <Loader2Icon size={16} className='me-2 animate-spin' />
          )}
          Sign up
        </Button>
        <Link href='/signin' className='text-end text-xs text-muted-foreground'>
          Already have an account? <strong>Sign in</strong>
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
          type='button'
          variant='outline'
          onClick={handleSignUpWithGoogle}>
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
          type='button'
          variant='outline'
          onClick={handleSignUpWithGithub}>
          <Image
            src={'/assets/github.svg'}
            width={24}
            height={24}
            alt='Github sign up'
            className='me-2'
          />
          GitHub
        </Button>
      </form>
    </Form>
  )
}
