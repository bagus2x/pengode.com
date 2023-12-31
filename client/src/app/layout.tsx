import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import '@pengode/app/globals.css'
import { cn } from '@pengode/common/tailwind'
import { QueryClientProvider } from '@pengode/components/query-client'
import { TopLoader } from '@pengode/components/ui/top-loader'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@pengode/components/theme-provider'
import { BlockUi } from '@pengode/components/ui/block-ui'
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@pengode/components/google-analytics'
import { env } from '@pengode/common/utils'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Pengode',
  description: 'An app by Tubagus Saifulloh',
  icons: '/assets/astronaut.svg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='scroll-smooth' suppressHydrationWarning>
      <body
        className={cn(
          'scrollbar scrollbar-track-secondary scrollbar-thumb-primary/50 scrollbar-thumb-rounded-2xl scrollbar-w-2 scrollbar-h-2',
          poppins.className,
        )}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <TopLoader />
          <Toaster richColors />
          <QueryClientProvider>
            <SessionProvider>{children}</SessionProvider>
          </QueryClientProvider>
          <BlockUi />
        </ThemeProvider>
        <GoogleAnalytics id={env('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID')} />
      </body>
    </html>
  )
}

