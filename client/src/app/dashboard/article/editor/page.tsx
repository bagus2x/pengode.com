import { Suspense } from 'react'

import { ArticleForm } from '@pengode/components/dashboard/article/article-form'

export default function ArticleFormPage() {
  return (
    <main>
      <Suspense>
        <ArticleForm className='px-4' />
      </Suspense>
    </main>
  )
}
