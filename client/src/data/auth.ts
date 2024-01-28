'use server'

import {
  signIn as signInWithNextAuth,
  signOut as signOutWithNextAuth,
} from '@pengode/auth'
import { post, withAuth } from '@pengode/common/rest-client'
import { env } from '@pengode/common/utils'

export interface Auth {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    username: string
    name: string
    photo?: string | null
    roles: { id: number; name: string }[]
  }
}

export async function signIn(req: { username: string; password: string }) {
  return await post<Auth>({
    url: `${env('PENGODE_API_BASE_URL')}/auth/signin`,
    body: req,
  })
}

export async function signUp(req: {
  email: string
  username: string
  password: string
  name: string
}) {
  return await post<Auth>({
    url: `${env('PENGODE_API_BASE_URL')}/auth/signup`,
    body: req,
  })
}

export async function signInWithCredentials(
  req: Parameters<typeof signIn>[0] & Parameters<typeof signInWithNextAuth>[1],
) {
  return await signInWithNextAuth('credentials', { ...req })
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

export interface RefreshTokensRequest {
  token: string
}

export async function refreshTokens(req: RefreshTokensRequest) {
  const url = `${env('PENGODE_API_BASE_URL')}/auth/refresh-tokens`
  return await withAuth(post, `Bearer ${req.token}`)<Auth>({ url, body: {} })
}
