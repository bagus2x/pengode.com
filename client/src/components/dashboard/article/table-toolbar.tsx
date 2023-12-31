import {
  CalendarIcon,
  CheckIcon,
  LineChartIcon,
  PlusCircleIcon,
  PlusIcon,
  Settings2Icon,
} from 'lucide-react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Badge } from '@pengode/components/ui/badge'
import { Button } from '@pengode/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@pengode/components/ui/command'
import { Input } from '@pengode/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pengode/components/ui/popover'
import { Separator } from '@pengode/components/ui/separator'
import { ArticleStatus } from '@pengode/data/article-status'
import Link from 'next/link'

export type TableToolbarProps = PropsWithClassName & {
  search: string
  onSearch: (search: string) => void
  statuses: ArticleStatus[]
  selectedStatuses: ArticleStatus[]
  onChangeStatuses: (statuses: ArticleStatus[]) => void
}

export const TableToolbar = ({
  search,
  onSearch,
  className,
  statuses,
  selectedStatuses,
  onChangeStatuses,
}: TableToolbarProps) => {
  const handleChangeStatuses = (selected: ArticleStatus, only?: boolean) => {
    if (only) {
      onChangeStatuses([selected])
      return
    }

    if (selectedStatuses.includes(selected)) {
      if (selectedStatuses.length === 1) return

      onChangeStatuses(
        selectedStatuses.filter((status) => status.id !== selected.id),
      )
      return
    }

    onChangeStatuses([...selectedStatuses, selected])
  }

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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='border-dashed'>
              <PlusCircleIcon className='me-2 h-4 w-4' />
              Status
              <Separator orientation='vertical' className='mx-2 h-4' />
              {selectedStatuses.length < 3 ? (
                <div className='space-x-1'>
                  {selectedStatuses.map((status) => (
                    <Badge key={status.id} variant='secondary'>
                      {status.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Badge variant='secondary'>
                  {selectedStatuses.length} Selected
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput />
              <CommandEmpty />
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.id}
                    onSelect={() => handleChangeStatuses(status)}
                    className='group items-center'>
                    <CheckIcon
                      className={cn(
                        'me-2 h-4 w-4',
                        !selectedStatuses
                          .map((status) => status.id)
                          .includes(status.id) && 'opacity-0',
                      )}
                    />
                    <span className='flex-1'>{status.name}</span>
                    <Button
                      size='sm'
                      variant='secondary'
                      onClick={(ev) => {
                        ev.stopPropagation()
                        handleChangeStatuses(status, true)
                      }}
                      className='h-6 px-2 py-1 text-xs opacity-0 transition-all group-hover:opacity-100'>
                      Only
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
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
          <Link href='/dashboard/article/editor'>
            <PlusIcon className='me-2 h-4 w-4' />
            Create
          </Link>
        </Button>
      </div>
    </div>
  )
}