'use client'

import dayjs from 'dayjs'
import { Calendar as CalendarIcon } from 'lucide-react'
import { SelectSingleEventHandler } from 'react-day-picker'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Button } from '@pengode/components/ui/button'
import { Calendar } from '@pengode/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pengode/components/ui/popover'

export type DatePickerProps = PropsWithClassName & {
  value?: Date
  onChange?: SelectSingleEventHandler
  placeholder?: string
}

export const DatePicker = ({
  className,
  value,
  onChange,
  placeholder,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            className,
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value
            ? dayjs(value).format('DD MM YY HH:MM')
            : placeholder && <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
