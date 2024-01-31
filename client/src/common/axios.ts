import { auth } from '@pengode/auth'
import axiosDefault, { AxiosError } from 'axios'
import { getSession } from 'next-auth/react'

export const axiosWithAuth = () => {
  const instance = axiosDefault.create()

  instance.interceptors.request.use(async (request) => {
    let token: string | undefined
    if (typeof window === 'undefined') {
      const session = await auth()
      token = session?.user.accessToken
    } else {
      const session = await getSession()

      token = session?.user.accessToken
    }

    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }

    return request
  })

  return instance
}

declare module 'axios' {
  export interface AxiosInstance {
    auth: AxiosInstance
  }
}

const axios = axiosDefault.create()
axios.auth = axiosWithAuth()

export default axios

export const errorMessages = (err: Error) => {
  if (err instanceof AxiosError) {
    if (typeof err?.response?.data?.message === 'string')
      return [err?.response?.data?.message]
    return err?.response?.data?.message as string[]
  }

  return [err.message]
}
