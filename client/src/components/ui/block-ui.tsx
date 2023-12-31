'use client'

import { create } from 'zustand'
import * as Portal from '@radix-ui/react-portal'
import { Loader2Icon } from 'lucide-react'

export interface BlockUiState {
  visible: boolean
  block: () => void
  unblock: () => void
}

export const useBlockUi = create<BlockUiState>((set) => ({
  visible: false,
  block: () => set((state) => ({ ...state, visible: true })),
  unblock: () => set((state) => ({ ...state, visible: false })),
}))

export function BlockUi() {
  const blockUi = useBlockUi()

  if (!blockUi.visible) {
    return null
  }

  return (
    <Portal.Root className='fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center bg-black/50 backdrop-blur-sm'>
      <Loader2Icon className='animate-spin text-white' />
    </Portal.Root>
  )
}
