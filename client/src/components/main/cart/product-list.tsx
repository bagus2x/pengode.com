'use client'

import { useMemo, useState } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { ProductItem } from '@pengode/components/main/cart/product-item'
import { Product } from '@pengode/data/product'
import { getProducts, removeProduct } from '@pengode/data/product-cart'
import { Page } from '@pengode/data/types'
import { Button } from '@pengode/components/ui/button'
import { toast } from 'sonner'
import Decimal from 'decimal.js'
import { RupiahFormatter } from '@pengode/common/utils'
import { createInvoice } from '@pengode/data/product-invoice'
import { useRouter } from 'next/navigation'
import { restErrorMessages } from '@pengode/common/rest-client'
import { Loader2Icon } from 'lucide-react'

export type ProductListProps = PropsWithClassName & {
  products: Page<Product>
}

export const ProductList = ({ className, products }: ProductListProps) => {
  const queryClient = useQueryClient()
  const { data: productPages } = useInfiniteQuery({
    queryKey: ['GET_INFINITE_PRODUCT_CART'],
    queryFn: async ({ pageParam }) =>
      await getProducts({ cursor: { nextCursor: pageParam } }),
    initialData: () => {
      return {
        pageParams: [undefined],
        pages: [products],
      }
    },
    initialPageParam: Math.pow(2, 31) - 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  })
  const [selectedProducts, setSelectedProduct] = useState<Product[]>([])
  const { selectedProductIds, grossAmount } = useMemo(() => {
    return selectedProducts.reduce(
      (acc, product) => ({
        ...acc,
        grossAmount: acc.grossAmount.add(
          new Decimal(product.price).sub(
            new Decimal(product.price).times(product.discount || 0),
          ),
        ),
        selectedProductIds: [product.id, ...acc.selectedProductIds],
      }),
      {
        selectedProductIds: [] as number[],
        grossAmount: new Decimal(0),
      },
    )
  }, [selectedProducts])
  const removeProductsMutation = useMutation<Product[], Error, number[]>({
    mutationFn: (productIds) => {
      return Promise.all(
        productIds.map((productId) => removeProduct(productId)),
      )
    },
  })
  const createInvoiceMutation = useMutation({ mutationFn: createInvoice })
  const router = useRouter()

  const handleSelectProduct =
    (selectedProduct: Product) => (selected: boolean) => {
      const exists = selectedProducts.find(
        (product) => product.id === selectedProduct.id,
      )
      if (!exists && selected) {
        setSelectedProduct([selectedProduct, ...selectedProducts])
        return
      }

      setSelectedProduct(
        selectedProducts.filter((product) => product.id !== selectedProduct.id),
      )
    }

  const handleRemoveProducts = () => {
    removeProductsMutation.mutate(selectedProductIds, {
      onSuccess: async (products) => {
        await queryClient.invalidateQueries({
          queryKey: ['GET_INFINITE_PRODUCT_CART'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['GET_PRODUCT_CART'],
        })
        setSelectedProduct([])
        toast.success(`${products.length} products are removed`)
      },
    })
  }

  const handleCreateInvoice = () => {
    createInvoiceMutation.mutate(
      { productIds: selectedProductIds },
      {
        onSuccess: async (invoice) => {
          toast.success(
            `Invoice created for ${selectedProducts.length} products`,
          )
          router.push(`/invoice/${invoice.id}`)
        },
        onError: (err) => {
          restErrorMessages(err).forEach((message) => {
            toast.error(message)
          })
        },
      },
    )
  }

  return (
    <section className={cn('mx-auto max-w-screen-xl', className)}>
      <h1 className='mb-8 scroll-m-20 text-2xl font-semibold tracking-tight'>
        Cart
      </h1>
      <div className={'flex items-start gap-4'}>
        <div className='flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-background'>
          {!productPages.pages[0]?.items.length && (
            <div className='p-4 text-center'>Your cart is empty</div>
          )}
          {!!selectedProducts.length && (
            <div className='flex w-full justify-end p-4'>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleRemoveProducts}>
                Remove ({selectedProducts.length})
              </Button>
            </div>
          )}
          {productPages.pages.map((page) =>
            page.items.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                selected={selectedProductIds.includes(product.id)}
                onSelect={handleSelectProduct(product)}
              />
            )),
          )}
        </div>
        <div className='w-full min-w-0 max-w-96 shrink-0 rounded-2xl border border-border bg-background p-4'>
          <h4 className='mb-4 font-semibold'>Shopping summary</h4>
          <div className='mb-4 flex items-center justify-between gap-4 text-sm'>
            <span>Total</span>
            <span>{RupiahFormatter.format(grossAmount)}</span>
          </div>
          <Button
            onClick={handleCreateInvoice}
            disabled={
              !selectedProducts.length || createInvoiceMutation.isPending
            }
            className='w-full'>
            {createInvoiceMutation.isPending && (
              <Loader2Icon size={16} className='me-2 animate-spin' />
            )}
            Buy ({selectedProducts.length})
          </Button>
        </div>
      </div>
    </section>
  )
}
