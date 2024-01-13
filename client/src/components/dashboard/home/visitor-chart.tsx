'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CountryFlag from 'react-country-flag'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@pengode/components/ui/card'

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Aug',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Sep',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Oct',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Nov',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Dec',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

const visitorCountries = [
  {
    code: 'ID',
    name: 'Indonesia',
    count: 12000,
  },
  {
    code: 'MY',
    name: 'Malaysia',
    count: 10200,
  },
]

export function VisitorChart({ className }: PropsWithClassName) {
  return (
    <section
      className={cn(
        'mx-auto grid max-w-screen-xl grid-cols-1 gap-4 md:grid-cols-2',
        className,
      )}>
      <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>Visitor</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey='name'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Bar
                dataKey='total'
                fill='currentColor'
                radius={[4, 4, 0, 0]}
                className='fill-primary'
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>
            Visitors by countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='flex flex-col'>
            {visitorCountries.map((country) => (
              <li
                key={country.code}
                className='flex items-center gap-4 border-b py-4 transition-colors data-[state=selected]:bg-muted hover:bg-muted/50'>
                <CountryFlag
                  countryCode={country.code}
                  svg
                  className='rounded text-2xl'
                />
                <span className='flex-1 text-sm'>{country.name}</span>
                <span className='text-sm text-muted-foreground'>
                  {new Intl.NumberFormat('ID').format(country.count)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
