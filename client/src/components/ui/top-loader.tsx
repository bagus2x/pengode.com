'use client'

import { usePathname, useRouter } from 'next/navigation'
import NextTopLoader, { NextTopLoaderProps } from 'nextjs-toploader'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { slate } from 'tailwindcss/colors'

export const TopLoader = (props: NextTopLoaderProps) => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    NProgress.done()
  }, [pathname, router])
  return (
    <NextTopLoader
      {...props}
      color={slate[900]}
      template={`
        <div class="bar" role="bar">
            <div class="peg">
                </div></div> 
                <div class="spinner" role="spinner">
                <div class="spinner-icon">
            </div>
        </div>
      `}
    />
  )
}
