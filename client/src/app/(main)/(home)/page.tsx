import { ProductList } from '@pengode/components/main/home/product-list'
import { getProducts } from '@pengode/data/product/product-api'

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main className='py-4'>
      <ProductList products={products} className='px-4' />
    </main>
  )
}
