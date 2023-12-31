'use client'

import { CheckIcon, ChevronDown, X } from 'lucide-react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Badge } from '@pengode/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@pengode/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pengode/components/ui/popover'

export type MultiSelectProps = PropsWithClassName & {
  options: { value: string; label: string }[]
  values: Set<string>
  placeholder?: string
  onChange: (values: Set<string>) => void
}

export function MultiSelect({
  className,
  options,
  values,
  placeholder,
  onChange,
}: MultiSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'relative flex min-h-[36px] items-center justify-end rounded-md border data-[state=open]:border-ring',
            className,
          )}>
          <div className='relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden px-3 py-1'>
            {values?.size > 0 ? (
              options &&
              options
                .filter((option) => values.has(option.value))
                .map((option) => (
                  <Badge
                    key={option.value}
                    variant='secondary'
                    className='m-[2px] gap-1 pr-0.5'>
                    <span className=''>{option.label}</span>
                    <span
                      onClick={(e) => {
                        e.preventDefault()
                        const next = new Set(values)
                        next.delete(option.value)
                        onChange(next)
                      }}
                      className='flex items-center rounded-sm px-[1px] hover:bg-accent hover:text-red-500'>
                      <X size={14} />
                    </span>
                  </Badge>
                ))
            ) : (
              <span className='mr-auto text-sm text-muted-foreground'>
                {placeholder || 'Select...'}
              </span>
            )}
          </div>
          <div className='flex min-h-[40px] flex-shrink-0 items-center self-stretch px-1 text-muted-foreground/60'>
            <span className='mx-0.5 my-2 w-[1px] self-stretch bg-border' />
            <div className='flex items-center self-stretch p-2 hover:text-muted-foreground'>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'>
        <Command>
          <CommandInput placeholder='Search numbers...' className='h-9' />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {options.map((option, index) => {
              const isSelected = values.has(option.value)
              return (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    if (isSelected) {
                      values.delete(option.value)
                    } else {
                      values.add(option.value)
                    }
                    const filterValues = Array.from(values)
                    onChange(new Set(filterValues))
                  }}>
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible',
                    )}>
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
