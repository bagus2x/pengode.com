import { VisitorChart } from '@pengode/components/dashboard/home/visitor-chart'
import { VisitorStats } from '@pengode/components/dashboard/home/visitor-stats'

export default async function DashboardPage() {
  return (
    <main>
      <VisitorStats className='mb-4 px-4' />
      <VisitorChart className='px-4' />
    </main>
  )
}
