import React, { useEffect, useState } from 'react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@pengode/components/ui/drawer'

export const useMidtransSnap = () => {
  const [snap, setSnap] = useState<any>(null)

  useEffect(() => {
    // You can also change below url value to any script url you wish to load,
    // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'

    let scriptTag = document.createElement('script')
    scriptTag.src = midtransScriptUrl

    // Optional: set script attribute, for example snap.js have data-client-key attribute
    // (change the value according to your client-key)
    const myMidtransClientKey = 'SB-Mid-client-nA-or7yZy1erCYRG'
    scriptTag.setAttribute('data-client-key', myMidtransClientKey)
    scriptTag.onload = () => {
      setSnap((window as any).snap)
    }

    document.body.appendChild(scriptTag)

    return () => {
      document.body.removeChild(scriptTag)
    }
  }, [])

  const handleSnapEmbed = ({
    snapToken,
    embedId,
    onSuccess,
    onPending,
    onClose,
  }: {
    snapToken: string
    embedId: string
    onSuccess: (result: unknown) => void
    onPending: (result: unknown) => void
    onClose: (result: unknown) => void
  }) => {
    if (!snap) {
      return
    }

    snap.embed(snapToken, { embedId, onSuccess, onPending, onClose })
  }

  return handleSnapEmbed
}

type MidtransPaymentProps = PropsWithClassName & {
  snapToken: string
  onSuccess: (result: unknown) => void
  onPending: (result: unknown) => void
  onClose: (result: unknown) => void
}

const MidtransPayment = ({
  className,
  snapToken,
  onSuccess,
  onPending,
  onClose,
}: MidtransPaymentProps) => {
  const handleSnapEmbed = useMidtransSnap()

  useEffect(() => {
    handleSnapEmbed({
      embedId: 'midtrans-payment',
      snapToken,
      onSuccess,
      onPending,
      onClose,
    })
  }, [handleSnapEmbed, onClose, onPending, onSuccess, snapToken])

  return <div id='midtrans-payment' className={cn('w-full', className)} />
}

export type PaymentDrawerProps = PropsWithClassName & {
  renderButton: React.ReactNode
  snapToken: string
  onSuccess: (result: unknown) => void
  onPending: (result: unknown) => void
  onClose: (result: unknown) => void
}

export const PaymentDrawer = ({
  className,
  renderButton,
  snapToken,
  onSuccess,
  onPending,
  onClose,
}: PaymentDrawerProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer onOpenChange={setOpen}>
      <DrawerTrigger asChild>{renderButton}</DrawerTrigger>
      <DrawerContent className={cn('min-h-[90%] pt-4', className)}>
        <DrawerHeader>
          <DrawerTitle>Payment</DrawerTitle>
        </DrawerHeader>
        <div>
          {open && (
            <MidtransPayment
              snapToken={snapToken}
              onSuccess={onSuccess}
              onPending={onPending}
              onClose={onClose}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
