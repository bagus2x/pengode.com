import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { signIn as signInWithNextAuth } from 'next-auth/react'

import { Auth } from '@pengode/data/auth/auth'
import { signIn, signUp } from '@pengode/data/auth/auth-api'
import { RestError } from '@pengode/data/types'

export const useSignInMutation = () => {
  return useMutation<Auth, AxiosError<RestError>, Parameters<typeof signIn>[0]>(
    {
      mutationFn: async (req) => {
        const res = await signIn(req)
        await signInWithNextAuth('credentials', {
          data: JSON.stringify(res),
          redirect: false,
        })
        return res
      },
    },
  )
}

export const useSignUpMutation = () => {
  return useMutation<Auth, AxiosError<RestError>, Parameters<typeof signUp>[0]>(
    {
      mutationFn: async (req) => {
        const res = await signUp(req)
        await signInWithNextAuth('credentials', {
          data: JSON.stringify(res),
          redirect: false,
        })
        return res
      },
    },
  )
}
