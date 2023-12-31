import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@pengode/components/ui/button'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'

export function ButtonSocials({ className }: PropsWithClassName) {
  return (
    <div className={cn('flex gap-4', className)}>
      <Button size='icon' variant='default'>
        <Link target='_blank' href='https://www.linkedin.com/in/tubagussa'>
          <LinkedinIcon />
        </Link>
      </Button>
      <Button size='icon' variant='default'>
        <Link target='_blank' href='https://www.github.com/bagus2x'>
          <GithubIcon />
        </Link>
      </Button>
      <Button size='icon' variant='default'>
        <Link target='_blank' href='https://www.instagram.com/bagus2x'>
          <InstagramIcon />
        </Link>
      </Button>
      <Button size='icon' variant='default'>
        <Link href='mailto:tubagus.sflh@gmail.com'>
          <MailIcon />
        </Link>
      </Button>
    </div>
  )
}
