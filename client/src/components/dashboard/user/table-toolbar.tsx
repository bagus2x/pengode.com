import {
  CalendarIcon,
  LineChartIcon,
  MailOpen,
  Settings2Icon,
} from 'lucide-react'
import Link from 'next/link'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Button } from '@pengode/components/ui/button'
import { Input } from '@pengode/components/ui/input'

export type TableToolbarProps = PropsWithClassName & {
  search: string
  onSearch: (search: string) => void
}

export const TableToolbar = ({
  search,
  onSearch,
  className,
}: TableToolbarProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between gap-2 md:flex-row',
        className,
      )}>
      <div className='flex flex-col gap-2 md:flex-row'>
        <Input
          value={search}
          onChange={(ev) => onSearch(ev.target.value)}
          placeholder='Search...'
          className='h-9 w-full md:max-w-[240px]'
        />
      </div>
      <div className='flex gap-2'>
        <Button size='circle-sm' variant='outline'>
          <LineChartIcon className='h-4 w-4' />
        </Button>
        <Button size='circle-sm' variant='outline'>
          <CalendarIcon className='h-4 w-4' />
        </Button>
        <Button size='sm' variant='outline'>
          <Settings2Icon className='me-2 h-4 w-4' />
          View
        </Button>
        <Button size='sm' asChild>
          <Link href='#'>
            <MailOpen className='me-2 h-4 w-4' />
            Invite
          </Link>
        </Button>
      </div>
    </div>
  )
}
