import type { NextAuthConfig, User } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { jwtDecode } from 'jwt-decode'

import { Auth } from '@pengode/data/auth/auth'
import { github, google, refreshTokens } from '@pengode/data/auth/auth-api'

declare module 'next-auth' {
  interface Session {
    user: Omit<User, 'id'> & {
      id: number
      name: string
      email: string
      image?: string | null
      roles: { id: number; name: string }[]
      accessToken: string
      refreshToken: string
    }
  }
}

export const authConfig: NextAuthConfig = {
  debug: true,
  session: {
    strategy: 'jwt',
  },
  events: {},
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      credentials: { data: { type: 'input' } },
      async authorize({ data: dataStr }) {
        const data = JSON.parse(dataStr as string) as Auth

        return {
          id: `${data.user.id}`,
          email: data.user.email,
          name: data.user.name,
          image: data.user.photo,
          roles: data.user.roles,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }
      },
    }),
  ],
  callbacks: {
    signIn: () => {
      return true
    },
    authorized(params) {
      return !!params.auth?.user
    },
    async jwt({ account, token, user }) {
      if (account?.provider === 'github' && account?.access_token) {
        const res = await github({ token: account.access_token })
        token.id = res.user.id
        token.roles = res.user.roles
        token.accessToken = res.accessToken
        token.refreshToken = res.refreshToken
      } else if (account?.provider === 'google' && account.id_token) {
        const res = await google({ token: account.id_token })
        token.id = res.user.id
        token.roles = res.user.roles
        token.accessToken = res.accessToken
        token.refreshToken = res.refreshToken
      } else if (
        account?.provider === 'credentials' &&
        (user as any).accessToken
      ) {
        token.id = parseInt(user.id!!)
        token.roles = (user as any).roles
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
      }

      const accessToken = token.accessToken as string
      const refreshToken = token.refreshToken as string
      const exp = jwtDecode(accessToken).exp
      if (exp && Date.now() / 1000 > exp) {
        // Infinite Loop
        // const res = await refreshTokens({ token: refreshToken })
        // token.accessToken = res.accessToken
        // token.refreshToken = res.refreshToken
      }

      return token
    },
    async session({ session, token }: any) {
      if (token && token.accessToken && token.refreshToken) {
        session.user.id = token.id
        session.user.roles = token.roles
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
