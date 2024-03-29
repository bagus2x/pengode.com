import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { Dialog, DialogContent } from '@pengode/components/ui/dialog'
import { Article } from '@pengode/data/article/article'

export type ArticleInfoDialogProps = PropsWithClassName & {
  article?: Article | null
  open?: boolean
  onChangeOpen?: (open: boolean) => void
}

export const ArticleInfoDialog = ({
  className,
  open,
  onChangeOpen,
}: ArticleInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className={cn('w-full max-w-lg', className)}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis
        animi natus officia? Sapiente nostrum qui quos quasi! Minus voluptas
        illo voluptatibus cupiditate rerum neque sequi placeat odit nobis. Quod,
        vitae?
      </DialogContent>
    </Dialog>
  )
}
