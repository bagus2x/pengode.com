import { auth } from '@pengode/auth'

export const middleware = auth

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/cart',
    '/cart/:path*',
  ],
}
