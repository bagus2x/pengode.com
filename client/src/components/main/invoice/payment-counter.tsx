import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'

export type PaymentCounterProps = PropsWithClassName & {
  createdAt: string
}

dayjs.extend(relativeTime)

export const PaymentCounter = ({
  className,
  createdAt,
}: PaymentCounterProps) => {
  const [difference, setDifference] = useState('--:--:--')
  const time = new Date(new Date(createdAt).getTime() + 1 * 24 * 60 * 60 * 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setDifference(() => {
        const distance = time.getTime() - Date.now()
        if (distance < 0) {
          clearInterval(interval)
          return '00:00:00:00'
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (days === 0) return `${hours}:${minutes}:${seconds}`

        return `${days}:${hours}:${minutes}:${seconds}`
      })
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className={cn(className)}>{difference}</div>
}
