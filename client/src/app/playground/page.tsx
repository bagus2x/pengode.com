import { env } from '@pengode/common/utils'

export default function PlaygroundPage() {
  return (
    <div>
      <pre>
        BASE URL:{' '}
        {JSON.stringify({ url: env('PENGODE_API_BASE_URL') || 'nothing' })}
      </pre>
    </div>
  )
}
