import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Button } from '@pengode/components/ui/button'
import { DateTimePicker } from '@pengode/components/ui/date-time-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@pengode/components/ui/dialog'
import { Label } from '@pengode/components/ui/label'
import { Article } from '@pengode/data/article/article'

export type ArticleSchedulerDialogProps = PropsWithClassName & {
  article?: Article | null
  open?: boolean
  onChangeOpen?: (open: boolean) => void
  onSchedule?: (article: Article, time: Date) => void
}

export const ArticleSchedulerDialog = ({
  className,
  article,
  open,
  onChangeOpen,
  onSchedule,
}: ArticleSchedulerDialogProps) => {
  const [date, setDate] = useState<{ date: Date; hasTime: boolean }>({
    hasTime: true,
    date: new Date(),
  })

  const handleSchedule = () => {
    if (Date.now() > date.date.getTime()) {
      toast.error('Date time invalid')
      return
    }
    onSchedule?.(article!!, date.date)
    onChangeOpen?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className={cn('w-full max-w-lg', className)}>
        <DialogHeader>
          <DialogTitle>Schedule Article</DialogTitle>
          <DialogDescription>
            Publish <strong>{article?.title}</strong> at specific time.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div>
            <Label>Date</Label>
            <DateTimePicker
              onChange={setDate}
              value={date}
              disabled={{ before: new Date() }}
              className='w-full'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onChangeOpen?.(false)}>
            Cancel
          </Button>
          <Button type='submit' onClick={handleSchedule}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
