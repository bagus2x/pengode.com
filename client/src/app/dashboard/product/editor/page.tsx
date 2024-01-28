import { Suspense } from 'react'

import { ProductForm } from '@pengode/components/dashboard/product/product-form'

export default function ProductFormPage() {
  return (
    <main>
      <Suspense>
        <ProductForm className='px-4' />
      </Suspense>
    </main>
  )
}
