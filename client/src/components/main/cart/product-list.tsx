'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { errorMessages } from '@pengode/common/axios'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter } from '@pengode/common/utils'
import { ProductItem } from '@pengode/components/main/cart/product-item'
import { Button } from '@pengode/components/ui/button'
import {
  useGetCartProductsQuery,
  useRemoveProductFromCartMutation,
} from '@pengode/data/product-cart/product-cart-hook'
import { useCreateInvoiceMutation } from '@pengode/data/product-invoice/product-invoice-hook'
import { Product } from '@pengode/data/product/product'
import { Page } from '@pengode/data/types'
import Decimal from 'decimal.js'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type ProductListProps = PropsWithClassName & {
  products: Page<Product>
}

export const useSelectedProducts = () => {
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

  return {
    selectedProducts,
    setSelectedProduct,
    selectedProductIds,
    grossAmount,
  }
}

export const ProductList = ({
  className,
  products: initialProductPage,
}: ProductListProps) => {
  const queryClient = useQueryClient()
  const { data: productPages } = useGetCartProductsQuery({
    initialData: initialProductPage,
  })
  const {
    selectedProducts,
    setSelectedProduct,
    selectedProductIds,
    grossAmount,
  } = useSelectedProducts()
  const removeProductsFromCartMutation = useRemoveProductFromCartMutation()
  const createInvoiceMutation = useCreateInvoiceMutation()
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
    removeProductsFromCartMutation.mutate(selectedProductIds, {
      onSuccess: async (products) => {
        await queryClient.invalidateQueries({
          queryKey: useGetCartProductsQuery.key,
        })
        setSelectedProduct([])
        toast.success(`${products.length} products are removed`)
      },
      onError: (err) => {
        errorMessages(err).forEach((message) => {
          toast.error(message)
        })
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
          errorMessages(err).forEach((message) => {
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
          {!productPages?.pages[0]?.items.length && (
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
          {productPages?.pages?.map((page) =>
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
