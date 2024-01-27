import { SettingsIcon } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'

import { avatar } from '@pengode/common/utils'
import { Button } from '@pengode/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@pengode/components/ui/tabs'
import { getAuthUser } from '@pengode/data/user'
import { BoughtProductList } from '@pengode/components/main/profile/bought-product-list'

export const metadata: Metadata = {
  title: 'My profile',
}

export default async function ProfilePage() {
  const user = await getAuthUser()

  return (
    <main className='mx-auto max-w-screen-xl px-4 py-4'>
      <h4 className='mb-8 scroll-m-20 text-xl font-semibold tracking-tight'>
        Profile
      </h4>
      <div className='flex w-full flex-col items-start gap-4 md:flex-row'>
        <section className='w-full min-w-80 rounded-2xl border border-border bg-background p-4 md:max-w-96'>
          <div className='mb-4 flex items-center gap-4'>
            <Image
              src={avatar(user.username, user.photo)}
              width={320}
              height={320}
              alt={user.name}
              className='h-24 w-24 rounded-full'
            />
            <div className='flex flex-col justify-items-center'>
              <h6 className='truncate font-semibold'>
                {user.name}&nbsp;
                <span className='text-xs text-muted-foreground'>
                  {user.username}
                </span>
              </h6>
              <h6 className='mb-1 text-sm'>{user.email}</h6>
              <div className='flex gap-2'>
                <Button size='sm' className='h-8 flex-1 p-1 text-xs'>
                  Sign out
                </Button>
                <Button
                  variant='outline'
                  size='circle-sm'
                  className='h-8 p-1 text-xs'>
                  <SettingsIcon className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className='flex w-full flex-1 gap-4 rounded-2xl border border-border bg-background p-4'>
          <Tabs defaultValue='bought' className='w-full'>
            <TabsList className='w-full'>
              <TabsTrigger value='bought'>Bought</TabsTrigger>
              <TabsTrigger value='favorites'>Favorites</TabsTrigger>
              <TabsTrigger value='invoices'>Invoices</TabsTrigger>
              <TabsTrigger value='reviews'>Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value='bought'>
              <BoughtProductList />
            </TabsContent>
            <TabsContent value='favorites'>
              Make changes to your account here.
            </TabsContent>
            <TabsContent value='invoices'>
              Make changes to your account here.
            </TabsContent>
            <TabsContent value='reviews'>
              Change your password here.
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  )
}