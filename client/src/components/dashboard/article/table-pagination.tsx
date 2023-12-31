import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Button } from '@pengode/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pengode/components/ui/select'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export type TablePaginationProps = PropsWithClassName & {
  page?: number
  size?: number
  onChangeSize?: (size: number) => void
  length?: number
  disablePreviousPage: boolean
  onClickPreviousPage?: () => void
  disableNextPage: boolean
  onClickNextPage?: () => void
}

const pageSizes = [10, 15, 20, 25, 30, 50, 75, 100]

export const TablePagination = ({
  size,
  onChangeSize,
  className,
  length,
  onClickPreviousPage,
  disablePreviousPage,
  disableNextPage,
  onClickNextPage,
}: TablePaginationProps) => {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2',
        className,
      )}>
      <div className='flex-1 text-sm text-muted-foreground'>
        Showing {length || '-'} row(s) selected.
      </div>
      <div className='flex items-center gap-2'>
        <Select onValueChange={(value) => onChangeSize?.(parseInt(value))}>
          <SelectTrigger className='focus:ring-0 focus:ring-offset-0'>
            <SelectValue placeholder={size} />
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={disablePreviousPage}
          variant='outline'
          onClick={onClickPreviousPage}
          className='h-8 w-8 shrink-0 p-0'>
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <Button
          disabled={disableNextPage}
          variant='outline'
          onClick={onClickNextPage}
          className='h-8 w-8 shrink-0 p-0'>
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
