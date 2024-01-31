'use client'

import dayjs from 'dayjs'
import { EditIcon, Loader2Icon, MoreHorizontalIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter, avatar } from '@pengode/common/utils'
import { TableToolbar } from '@pengode/components/dashboard/product/table-toolbar'
import { Badge } from '@pengode/components/ui/badge'
import { Card } from '@pengode/components/ui/card'
import { useConfirmation } from '@pengode/components/ui/confirmation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pengode/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@pengode/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@pengode/components/ui/table'
import { Product } from '@pengode/data/product/product'
import { useGetProductsQuery } from '@pengode/data/product/product-hook'
import { Cursor } from '@pengode/data/types'

export const ProductTable = ({ className }: PropsWithClassName) => {
  const [cursor, setCursor] = useState<Cursor>({
    nextCursor: Math.pow(2, 31) - 1,
  })
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<Product['status'][]>(
    ['VISIBLE', 'INVISIBLE'],
  )
  const { data: productPages, ...getProductsQuery } = useGetProductsQuery({
    size,
    search,
  })
  const { confirm, ConfirmationDialog } = useConfirmation()
  const loaderRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <section className={cn('relative mx-auto max-w-screen-xl', className)}>
        <Card className='py-4'>
          <TableToolbar
            search={search}
            onSearch={setSearch}
            className='mb-4 px-4'
            selectedStatuses={selectedStatuses}
            onChangeStatuses={setSelectedStatuses}
          />
          <ScrollArea>
            <Table className='mb-4'>
              <TableHeader className='border-t border-t-border'>
                <TableRow>
                  <TableHead className='w-[120px]'>Owner</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className='w-[140px]'>Created At</TableHead>
                  <TableHead className='w-[40px] text-right'> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='border-b border-b-border'>
                {productPages?.pages?.map((page) =>
                  page.items.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className='w-28 font-medium'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src={avatar(
                              product.owner.name,
                              product.owner.photo,
                            )}
                            width={20}
                            height={20}
                            alt={product.owner.name}
                            className='shrink-0 rounded-full transition hover:scale-105'
                          />
                          <span className='flex-1 truncate'>
                            {product.owner.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-xs truncate'>
                        <Badge
                          className={cn(
                            'me-2',
                            product.status === 'INVISIBLE' &&
                              'bg-orange-100 text-orange-500 hover:bg-orange-100',
                            product.status === 'VISIBLE' &&
                              'bg-green-100 text-green-500 hover:bg-green-100',
                          )}>
                          {product.status.toLowerCase()}
                        </Badge>
                        {product.title}
                      </TableCell>
                      <TableCell>
                        {RupiahFormatter.format(product.price)}
                      </TableCell>
                      <TableCell>
                        {product.discount ? product.discount * 100 : 0}%
                      </TableCell>
                      <TableCell className='text-sm'>
                        {dayjs(new Date(product.createdAt)).format(
                          'DD MMM YY HH:MM',
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className='grid w-full place-items-center'>
                              <MoreHorizontalIcon className='h-4 w-4' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/product/editor?id=${product.id}`}>
                                <EditIcon className='me-2 h-4 w-4' />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
          <div className='relative flex w-full flex-col items-center justify-center'>
            <div
              ref={loaderRef}
              className='absolute left-1/2 top-1/2 mt-14 -translate-x-1/2 -translate-y-1/2 transform'>
              <Loader2Icon
                className={cn(
                  'animate-spin',
                  !getProductsQuery.isFetching && 'hidden',
                )}
              />
            </div>
          </div>
        </Card>
      </section>
      <ConfirmationDialog />
    </>
  )
}
