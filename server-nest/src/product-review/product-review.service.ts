import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClsService } from 'nestjs-cls'
import { DataSource, LessThan, MoreThan, Raw, Repository } from 'typeorm'

import { PageResponse } from '@pengode/common/dtos'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { ProductReview } from '@pengode/product-review/product-review'
import {
  CreateProductReviewRequest,
  FindAllRequest,
  ProductReviewResponse,
} from '@pengode/product-review/product-review.dto'
import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'

@Injectable()
export class ProductReviewService {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    private readonly clsService: ClsService,
    @InjectRepository(ProductReview)
    private readonly productReviewRepository: Repository<ProductReview>,
  ) {}

  async create(req: CreateProductReviewRequest) {
    const review = await this.dataSource.transaction(async (entityManager) => {
      const productReviewRepository = entityManager.getRepository(ProductReview)
      const productRepository = entityManager.getRepository(Product)
      const userRepository = entityManager.getRepository(User)
      const productInvoiceItemRepository =
        entityManager.getRepository(ProductInvoiceItem)

      const product = await productRepository.findOne({
        where: { id: req.productId },
      })
      if (!product) {
        throw new NotFoundException('product is not found')
      }

      const reviewer = await userRepository.findOne({
        where: { id: this.clsService.get<number>('userId') },
      })
      if (!reviewer) {
        throw new NotFoundException('user is not found')
      }

      const isPaid = await productInvoiceItemRepository.existsBy({
        invoice: {
          customer: { id: reviewer.id },
        },
        product: { id: product.id },
      })
      if (!isPaid) {
        throw new BadRequestException('cannot review unpaid product')
      }

      switch (req.star) {
        case 1:
          product.numberOfOneStars += 1
          break
        case 2:
          product.numberOfTwoStars += 1
          break
        case 3:
          product.numberOfThreeStars += 1
          break
        case 4:
          product.numberOfFourStars += 1
          break
        case 5:
          product.numberOfFiveStars += 1
          break
        default:
          throw new InternalServerErrorException('invalid star ' + req.star)
      }

      const review = await productReviewRepository.findOne({
        where: {
          reviewer: { id: reviewer.id },
          product: { id: product.id },
        },
      })
      if (!review) {
        await productRepository.save(product)

        const review = await productReviewRepository.save({
          reviewer,
          product,
          star: req.star,
          description: req.description,
        })
        review.product = product
        review.reviewer = reviewer

        return review
      }

      switch (review.star) {
        case 1:
          product.numberOfOneStars -= 1
          break
        case 2:
          product.numberOfTwoStars -= 1
          break
        case 3:
          product.numberOfThreeStars -= 1
          break
        case 4:
          product.numberOfFourStars -= 1
          break
        case 5:
          product.numberOfFiveStars -= 1
          break
        default:
          throw new InternalServerErrorException('invalid star ' + req.star)
      }

      await productRepository.save(product)

      review.description = req.description
      review.star = req.star
      review.product = product
      review.reviewer = reviewer
      await productReviewRepository.save(review)

      return review
    })

    return ProductReviewResponse.create(review)
  }

  async findReviewsByProductId(
    productId: number,
    req: FindAllRequest,
  ): Promise<PageResponse<ProductReviewResponse>> {
    const reviews = await this.productReviewRepository.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),
        product: {
          id: productId,
          title: req.search
            ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
            : undefined,
        },
        description: req.search
          ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
          : undefined,
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
      relations: {
        reviewer: true,
        product: true,
      },
    })

    return {
      items: reviews.map(ProductReviewResponse.create),
      previousCursor: reviews[0]?.id || 0,
      nextCursor: reviews[reviews.length - 1]?.id || 0,
    }
  }

  async findReviewsByReviewerId(
    reviewerId: number,
    req: FindAllRequest,
  ): Promise<PageResponse<ProductReviewResponse>> {
    const reviews = await this.productReviewRepository.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),
        reviewer: {
          id: reviewerId,
        },
        product: {
          title: req.search
            ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
            : undefined,
        },
        description: req.search
          ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
          : undefined,
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
      relations: {
        reviewer: true,
        product: true,
      },
    })

    return {
      items: reviews.map(ProductReviewResponse.create),
      previousCursor: reviews[0]?.id || 0,
      nextCursor: reviews[reviews.length - 1]?.id || 0,
    }
  }

  async findByAuthUserAndProductId(
    productId: number,
  ): Promise<ProductReviewResponse> {
    const review = await this.productReviewRepository.findOne({
      where: {
        reviewer: { id: this.clsService.get<number>('userId') },
        product: { id: productId },
      },
      relations: {
        reviewer: true,
        product: true,
      },
    })
    if (!review) {
      throw new NotFoundException('review is not found')
    }

    return ProductReviewResponse.create(review)
  }
}
