'use client'

import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { Heart as HeartIcon } from 'iconsax-react'
import {
  InfoIcon,
  Loader2Icon,
  MailIcon,
  Share2Icon,
  StarIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { toast } from 'sonner'

import { errorMessages } from '@pengode/common/axios'
import { cn } from '@pengode/common/tailwind'
import { PropsWithClassName } from '@pengode/common/types'
import { RupiahFormatter, avatar } from '@pengode/common/utils'
import { ReviewForm } from '@pengode/components/main/product/review-form'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@pengode/components/ui/alert'
import { AspectRatio } from '@pengode/components/ui/aspect-ratio'
import { Button } from '@pengode/components/ui/button'
import { Input } from '@pengode/components/ui/input'
import { Progress } from '@pengode/components/ui/progress'
import { Separator } from '@pengode/components/ui/separator'
import {
  useAddProductToCartMutation,
  useGetCartProductsQuery,
} from '@pengode/data/product-cart/product-cart-hook'
import { useCreateInvoiceMutation } from '@pengode/data/product-invoice/product-invoice-hook'
import { Product } from '@pengode/data/product/product'
import {
  useGetProductQuery,
  useToggleLikeProductMutation,
} from '@pengode/data/product/product-hook'

export type ProductDetailProps = PropsWithClassName &
  PropsWithChildren & {
    product: Product
  }

export const ProductDetail = ({
  className,
  children,
  product: initialProduct,
}: ProductDetailProps) => {
  const { data: product } = useGetProductQuery({
    productId: initialProduct.id,
    initialData: initialProduct,
  })
  const router = useRouter()
  const createInvoiceMutation = useCreateInvoiceMutation()
  const queryClient = useQueryClient()
  const addProductToCartMutation = useAddProductToCartMutation()
  const toggleLikeMutation = useToggleLikeProductMutation({
    productId: initialProduct.id,
  })
  if (!product) {
    return null
  }

  const numberOfStars =
    product.numberOfOneStars * 1 +
    product.numberOfTwoStars * 2 +
    product.numberOfThreeStars * 3 +
    product.numberOfFourStars * 4 +
    product.numberOfFiveStars
  const numberOfReviewers =
    product.numberOfOneStars +
    product.numberOfTwoStars +
    product.numberOfThreeStars +
    product.numberOfFourStars +
    product.numberOfFiveStars

  const handleCreateInvoice = () => {
    createInvoiceMutation.mutate(
      { productIds: [product.id] },
      {
        onSuccess: (invoice) => {
          router.push(`/invoice/${invoice.id}`)
          toast.success('Invoice created')
        },
        onError: (err) => {
          errorMessages(err).forEach((message) => {
            toast.error(message)
          })
        },
      },
    )
  }

  const handleAddToCart = () => {
    addProductToCartMutation.mutate(
      { productId: product.id },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: useGetCartProductsQuery.key,
          })
          toast.success(`${product.title} has been added to cart`)
        },
        onError: (err) => {
          errorMessages(err).forEach((message) => {
            toast.error(message)
          })
        },
      },
    )
  }

  const handleToggleLike = () => {
    toggleLikeMutation.mutate(product.id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: useGetProductQuery.key(product.id),
        })

        if (product.liked) {
          toast.success(`${product.title} has been liked`)
        } else {
          toast.success(`${product.title} has been removed from likes`)
        }
      },
      onError: (err) => {
        errorMessages(err).forEach((message) => {
          toast.error(message)
        })
      },
    })
  }

  return (
    <section
      className={cn(
        'mx-auto flex max-w-screen-xl flex-col items-start gap-4 sm:flex-row',
        className,
      )}>
      <div className='flex w-full min-w-0 flex-1 flex-col gap-4'>
        <AspectRatio
          ratio={3 / 2}
          className='h-full w-full overflow-hidden rounded-2xl'>
          <Image
            src={product.previewUrl}
            width={1280}
            height={(3 / 2) * 1280}
            alt={product.title}
            className='h-full w-full object-cover'
          />
        </AspectRatio>
        <div className='flex gap-2'>
          <Button size='sm'>Preview</Button>
          <Button size='sm'>Hire us!</Button>
          <div className='flex-1' />
          <div className='flex'>
            <Image
              src={avatar(product.owner.username, product.owner.photo)}
              width={32}
              height={32}
              alt={product.owner.name}
              className='me-2 h-8 w-8 shrink-0 rounded-full'
            />
            <div className='flex flex-col text-xs'>
              <span className='font-semibold'>{product.owner.name}</span>
              <button className='flex flex-row items-center text-[10px]'>
                <MailIcon className='me-1 h-3 w-3 text-muted-foreground' />
                Contact
              </button>
            </div>
          </div>
        </div>
        <div className='min-w-0 max-w-full flex-1 rounded-2xl border border-border bg-background p-4'>
          <h1 className='mb-4 scroll-m-20 text-2xl font-semibold tracking-tight'>
            {product.title}
          </h1>
          <div className='prose prose-slate w-full max-w-full [&>p]:break-words'>
            {children}
          </div>
        </div>
        {product.paid && (
          <div className='min-w-0 max-w-full flex-1 rounded-2xl border border-border bg-background p-4'>
            <h1
              id='reviews'
              className='mb-4 scroll-m-20 text-2xl font-semibold tracking-tight'>
              Reviews
            </h1>
            <div className='prose prose-slate w-full max-w-full [&>p]:break-words'>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        )}
      </div>
      <div className='w-full min-w-64 sm:max-w-xs'>
        {product.paid && (
          <Alert className='mb-4'>
            <InfoIcon className='h-4 w-4' />
            <AlertTitle>Congrats!</AlertTitle>
            <AlertDescription>You have owned this product!</AlertDescription>
          </Alert>
        )}
        <div className='mb-4 rounded-2xl border border-border bg-background p-4'>
          <div className='mb-4'>
            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
              {RupiahFormatter.format(
                new Decimal(product.price).sub(
                  new Decimal(product.price).times(product.discount || 0),
                ),
              )}
            </h3>
            {product.discount && (
              <div className='text-xs'>
                <span className='me-2 text-muted-foreground line-through'>
                  {RupiahFormatter.format(new Decimal(product.price))}
                </span>
                <span className='font-bold text-red-500'>
                  {product.discount * 100}%
                </span>
              </div>
            )}
          </div>
          {!product.paid && (
            <>
              <Input readOnly placeholder='Coupon' className='mb-4' />
              <Button
                className='w-full'
                onClick={handleCreateInvoice}
                disabled={createInvoiceMutation.isPending}>
                {createInvoiceMutation.isPending && (
                  <Loader2Icon size={16} className='me-2 animate-spin' />
                )}
                Buy
              </Button>
            </>
          )}
          <Separator className='mb-4' />
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleAddToCart}
              className='mb-4 w-full'
              disabled={addProductToCartMutation.isPending}>
              {addProductToCartMutation.isPending && (
                <Loader2Icon size={16} className='me-2 animate-spin' />
              )}
              + Add to cart
            </Button>
            <Button
              onClick={handleToggleLike}
              disabled={toggleLikeMutation.isPending}
              variant='outline'
              size='circle-sm'
              className='shrink-0'>
              <HeartIcon
                variant={product.liked ? 'Bold' : 'Outline'}
                className={cn(
                  'h-4 w-4 text-muted-foreground',
                  product.liked && 'text-pink-500',
                )}
              />
            </Button>
            <Button variant='outline' size='circle-sm' className='shrink-0'>
              <Share2Icon className='h-4 w-4 text-muted-foreground' />
            </Button>
          </div>
        </div>
        <div className='mb-4 flex flex-col gap-4 rounded-2xl border border-border bg-background p-4'>
          <h4 className='mb-2 scroll-m-20 text-xl font-semibold tracking-tight'>
            Rating
          </h4>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-center'>
              <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                ⭐&nbsp;{numberOfStars / numberOfReviewers || 0}&nbsp;
              </h2>
              <h6 className='text-sm text-muted-foreground'>/&nbsp;5.0</h6>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <span>5</span>
              <StarIcon className='h-4 w-4 text-yellow-500' />
              <Progress
                value={
                  (product.numberOfFiveStars / numberOfReviewers) * 100 || 0
                }
                className='h-2'
              />
              <span>{product.numberOfFiveStars}</span>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <span>4</span>
              <StarIcon className='h-4 w-4 text-yellow-500' />
              <Progress
                value={
                  (product.numberOfFourStars / numberOfReviewers) * 100 || 0
                }
                className='h-2'
              />
              <span>{product.numberOfFourStars}</span>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <span>3</span>
              <StarIcon className='h-4 w-4 text-yellow-500' />
              <Progress
                value={
                  (product.numberOfThreeStars / numberOfReviewers) * 100 || 0
                }
                className='h-2'
              />
              <span>{product.numberOfThreeStars}</span>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <span>2</span>
              <StarIcon className='h-4 w-4 text-yellow-500' />
              <Progress
                value={
                  (product.numberOfTwoStars / numberOfReviewers) * 100 || 0
                }
                className='h-2'
              />
              <span>{product.numberOfTwoStars}</span>
            </div>
            <div className='flex items-center gap-2 text-xs'>
              <span>1</span>
              <StarIcon className='h-4 w-4 text-yellow-500' />
              <Progress
                value={
                  (product.numberOfOneStars / numberOfReviewers) * 100 || 0
                }
                className='h-2'
              />
              <span>{product.numberOfOneStars}</span>
            </div>
          </div>
          {product.paid && (
            <Button asChild variant='outline' size='sm'>
              <Link href='#reviews'>Write reviews</Link>
            </Button>
          )}
        </div>
        {product.paid && (
          <div className='flex flex-col gap-4 rounded-2xl border border-border bg-background px-2 py-4'>
            <h4 className='scroll-m-20 px-2 text-xl font-semibold tracking-tight'>
              Versions
            </h4>
            <div className='flex flex-col gap-3'>
              {product.logs.map((log) => (
                <div
                  key={log.id}
                  className='flex items-center gap-4 rounded border-b border-border p-2 py-2 transition-all hover:bg-secondary'>
                  <Link
                    href={log.productUrl}
                    className='flex-1 truncate text-sm'>
                    {log.name}
                  </Link>
                  <span className='text-xs text-muted-foreground'>
                    {dayjs(log.createdAt).format('DD MMM YYYY')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
