'use client'

import { getCurrentProfile } from '@pengode/data/profile'
import { use } from 'react'

const getProfile = async () => {
  return await getCurrentProfile()
}

export function Suspensed() {
  const profile = use(getProfile())
  return <div></div>
}
