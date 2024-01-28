'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2Icon, MoreHorizontalIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { avatar } from '@pengode/common/utils'
import { Badge } from '@pengode/components/ui/badge'
import { Card } from '@pengode/components/ui/card'
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
import { Cursor } from '@pengode/data/types'
import { getUsers } from '@pengode/data/user'
import { TablePagination } from '@pengode/components/dashboard/user/table-pagination'
import { TableToolbar } from '@pengode/components/dashboard/user/table-toolbar'

export const UserTable = ({ className }: PropsWithClassName) => {
  const [cursor, setCursor] = useState<Cursor>({
    nextCursor: Math.pow(2, 31) - 1,
  })
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState('')
  const { data: users, ...getUsersQuery } = useQuery({
    queryKey: [
      'GET_USERS',
      cursor.previousCursor,
      cursor.nextCursor,
      size,
      search,
    ],
    queryFn: async () => await getUsers({ cursor, size, search }),
  })

  const handleNextCursor = () => {
    setCursor({ nextCursor: users?.nextCursor })
  }

  const handlePreviousCursor = () => {
    setCursor({ previousCursor: users?.previousCursor })
  }

  return (
    <>
      <section className={cn('relative mx-auto max-w-screen-xl', className)}>
        <Card className='py-4'>
          <TableToolbar
            search={search}
            onSearch={setSearch}
            className='mb-4 px-4'
          />
          <ScrollArea>
            <Table className='mb-4'>
              <TableHeader className='border-t border-t-border'>
                <TableRow>
                  <TableHead className='w-[120px]'> </TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className='w-[40px] text-right'> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='border-b border-b-border'>
                {users?.items?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='w-28 font-medium'>
                      <div className='flex items-center gap-2'>
                        <Image
                          src={avatar(user.name, user.photo)}
                          width={20}
                          height={20}
                          alt={user.name}
                          className='shrink-0 rounded-full transition hover:scale-105'
                        />
                        <span className='flex-1 truncate'>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-xs truncate'>
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles.map((role) => (
                        <Badge
                          key={role.id}
                          className={cn(
                            'me-2',
                            role.name === 'ADMIN' &&
                              'bg-orange-100 text-orange-500 hover:bg-orange-100',
                            role.name === 'USER' &&
                              'bg-green-100 text-green-500 hover:bg-green-100',
                          )}>
                          {role.name}
                        </Badge>
                      ))}
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
          <TablePagination
            size={size}
            onChangeSize={setSize}
            length={users?.items?.length}
            disablePreviousPage={false}
            onClickPreviousPage={handlePreviousCursor}
            disableNextPage={false}
            onClickNextPage={handleNextCursor}
            className='px-4'
          />
        </Card>
        {getUsersQuery.isLoading && (
          <div className='absolute left-1/2 top-1/2 mt-14 -translate-x-1/2 -translate-y-1/2 transform'>
            <Loader2Icon className='animate-spin' />
          </div>
        )}
      </section>
    </>
  )
}
