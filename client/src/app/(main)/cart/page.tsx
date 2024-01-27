import { ProductList } from '@pengode/components/main/cart/product-list'
import { getProducts } from '@pengode/data/product-cart'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My cart',
}

export default async function CartPage() {
  const products = await getProducts()

  return (
    <main className='py-4'>
      <ProductList products={products} className='px-4' />
    </main>
  )
}
