import { MDXRemote } from 'next-mdx-remote/rsc'

import { ProductDetail } from '@pengode/components/main/product/product-detail'
import { getProduct } from '@pengode/data/product'

export type ProductDetailProps = {
  params: {
    productId: string
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  const product = await getProduct(parseInt(params.productId))

  return (
    <main className='py-4'>
      <ProductDetail className='px-4' product={product}>
        <MDXRemote source={product.description} />
      </ProductDetail>
    </main>
  )
}
