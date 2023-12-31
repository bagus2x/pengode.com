import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@pengode/components/ui/alert-dialog'
import { useState } from 'react'

export interface Options {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function useConfirmation() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Options | undefined>()

  return {
    confirm: (options?: Options) => {
      setOpen(true)
      setOptions(options)
    },
    ConfirmationDialog: () => {
      return (
        <AlertDialog onOpenChange={setOpen} open={open}>
          <AlertDialogContent>
            <AlertDialogHeader>
              {options?.title && (
                <AlertDialogTitle>{options.title}</AlertDialogTitle>
              )}
              {options?.description && (
                <AlertDialogDescription>
                  {options.description}
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={options?.onCancel}>
                {options?.cancelText || 'Cancel'}
              </AlertDialogCancel>
              <AlertDialogAction onClick={options?.onConfirm}>
                {options?.confirmText || 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  }
}
