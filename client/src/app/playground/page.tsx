'use client'

import { useBlockUi } from '@pengode/components/ui/block-ui'
import { Button } from '@pengode/components/ui/button'

export default function PlaygroundPage() {
  const blockUi = useBlockUi()
  return (
    <div>
      <Button onClick={() => blockUi.block()}>Block</Button>
      <Button onClick={() => blockUi.unblock()}>Unblock</Button>
    </div>
  )
}
