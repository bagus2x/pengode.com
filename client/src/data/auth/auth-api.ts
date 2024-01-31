import axios from '@pengode/common/axios'
import { Auth } from '@pengode/data/auth/auth'

const BASE_URL = process.env.NEXT_PUBLIC_PENGODE_API_BASE_URL

export const signIn = async (req: { username: string; password: string }) => {
  const url = `${BASE_URL}/auth/signin`
  const res = await axios.post<Auth>(url, req)

  return res.data
}

export const signUp = async (req: {
  email: string
  username: string
  password: string
  name: string
}) => {
  const url = `${BASE_URL}/auth/signup`
  const res = await axios.post<Auth>(url, req)

  return res.data
}

export const github = async (req: { token: string }) => {
  const url = `${BASE_URL}/auth/github`
  const res = await axios.post<Auth>(url, req)

  return res.data
}

export const google = async (req: { token: string }) => {
  const url = `${BASE_URL}/auth/google`
  const res = await axios.post<Auth>(url, req)

  return res.data
}

export const refreshTokens = async (req: { token: string }) => {
  const url = `${BASE_URL}/auth/refresh-tokens`
  const res = await axios.auth.post<Auth>(url, req)

  return res.data
}
