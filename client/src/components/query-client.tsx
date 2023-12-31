'use client'

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import { PropsWithChildren, useMemo } from 'react'

export function QueryClientProvider({ children }: PropsWithChildren) {
  const client = useMemo(() => new QueryClient(), [])

  return (
    <TanstackQueryClientProvider client={client}>
      {children}
    </TanstackQueryClientProvider>
  )
}
