import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { ProductDetail } from '@pengode/components/main/product/product-detail'
import { getProduct } from '@pengode/data/product/product-api'

export type ProductDetailProps = {
  params: {
    productId: string
  }
}

export const generateMetadata = async ({
  params,
}: ProductDetailProps): Promise<Metadata> => {
  const product = await getProduct(parseInt(params.productId))
  return {
    title: product.title,
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
