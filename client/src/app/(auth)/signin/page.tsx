import Link from 'next/link'
import { Suspense } from 'react'

import { SignInForm } from '@pengode/components/auth/signin-form'
import { Astronaut } from '@pengode/components/ui/astronaut'

export default function SignInPage() {
  return (
    <main className='flex min-h-screen'>
      <div className='hidden flex-1 flex-col justify-between bg-primary p-8 text-primary-foreground dark:bg-background dark:text-foreground md:flex'>
        <Link className='flex items-center gap-4' href='/'>
          <Astronaut className='h-8 w-8 [&>*]:fill-white' />
          <div className='scroll-m-20 text-xl tracking-tight'>Pengode</div>
        </Link>
        <div>
          <p>
            &quot;It doesn&apos;t matter how beautiful your theory is, it
            doesn&apos;t matter how smart you are. If it doesn&apos;t agree with
            experiment, it&apos;s wrong.&quot;
          </p>
          <div className='text-md mt-2 font-semibold'>Richard P. Feynman</div>
        </div>
      </div>
      <div className='flex flex-1 flex-col items-center justify-center p-4 md:p-8'>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome Back!</h1>
        <p className='mb-8 text-muted-foreground'>
          Fill the data below to sign in
        </p>
        <Suspense>
          <SignInForm className='w-full max-w-sm' />
        </Suspense>
      </div>
    </main>
  )
}
