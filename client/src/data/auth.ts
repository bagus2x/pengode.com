'use server'

import {
  signIn as signInWithNextAuth,
  signOut as signOutWithNextAuth,
} from '@pengode/auth'
import { post } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'

export interface SignInRequest {
  username: string
  password: string
}

export interface Auth {
  accessToken: string
  refreshToken: string // Not yet implemented,
  user: {
    id: number
    email: string
    username: string
    name: string
    photo?: string | null
  }
}

export async function signIn(req: SignInRequest) {
  return await post<Auth>({
    url: `${env('PENGODE_API_BASE_URL')}/auth/sign-in`,
    body: req,
  })
}

export async function signInWithCredentials(
  req: SignInRequest & Parameters<typeof signInWithNextAuth>[1],
) {
  return await signInWithNextAuth('credentials', req)
}

export async function signInWithGithub(
  req?: Parameters<typeof signInWithNextAuth>[1],
) {
  return await signInWithNextAuth('github', req)
}

export async function signInWithGoogle(
  req?: Parameters<typeof signInWithNextAuth>[1],
) {
  return await signInWithNextAuth('google', req)
}

export interface SocialRequest {
  token: string
}

export async function github(req: SocialRequest) {
  return await post<Auth>({
    url: `${env('PENGODE_API_BASE_URL')}/auth/github`,
    body: req,
  })
}

export async function google(req: SocialRequest) {
  return await post<Auth>({
    url: `${env('PENGODE_API_BASE_URL')}/auth/google`,
    body: req,
  })
}

export async function signOut() {
  return signOutWithNextAuth()
}
