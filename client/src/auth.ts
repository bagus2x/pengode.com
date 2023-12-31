import type { NextAuthConfig, User } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import { signIn as credentialSignIn, github, google } from '@pengode/data/auth'

declare module 'next-auth' {
  interface Session {
    user: Omit<User, 'id'> & {
      id: number
      name: string
      email: string
      image?: string | null
      accessToken: string
    }
  }
}

declare module 'next-auth' {}

export const authConfig = {
  debug: true,
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
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize({ username, password }) {
        const res = await credentialSignIn({
          username: username as string,
          password: password as string,
        })

        return {
          name: res.user.name,
          email: res.user.email,
          image: res.user.photo,
          id: `${res.user.id}`,
          accessToken: res.accessToken,
        }
      },
    }),
  ],
  callbacks: {
    authorized(params) {
      return !!params.auth?.user
    },
    async jwt({ account, token, user }) {
      if (!account || !user.email || !user.name) return token

      if (account.provider === 'github' && account.access_token) {
        const res = await github({ token: account.access_token })
        token.id = res.user.id
        token.accessToken = res.accessToken
      } else if (account.provider === 'google' && account.id_token) {
        const res = await google({ token: account.id_token })
        token.id = res.user.id
        token.accessToken = res.accessToken
      } else if (
        account.provider === 'credentials' &&
        (user as any).accessToken
      ) {
        token.id = parseInt(user.id)
        token.accessToken = (user as any).accessToken
      }

      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.user.id = token.id as number
        session.user.accessToken = token.accessToken as string
      }

      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
