'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { signIn as signInWithNextAuth, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
  FormLabel,
  FormMessage,
} from '@pengode/components/ui/form'
import { Input } from '@pengode/components/ui/input'
import { useSignUpMutation } from '@pengode/data/auth/auth-hook'

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
  const signUpMutation = useSignUpMutation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    if (!session.data) return

    const isAdmin = session.data.user.roles.some(
      (role) => role.name === 'ADMIN',
    )
    if (isAdmin) router.replace('/dashboard')
    else router.replace('/')
  }, [router, session])

  const handleSignInUpWithCredentials = (req: z.infer<typeof formSchema>) => {
    signUpMutation.mutate(req, {
      onSuccess: async () => {
        toast.success('Signed up')
      },
      onError: (err) => {
        errorMessages(err).forEach((message) => {
          toast.error(message)
        })
      },
    })
  }

  const handleSignUpWithGoogle = async () => {
    await signInWithNextAuth('google')
  }

  const handleSignUpWithGithub = async () => {
    await signInWithNextAuth('github')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignInUpWithCredentials)}
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
