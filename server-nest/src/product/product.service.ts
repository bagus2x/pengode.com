import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Decimal from 'decimal.js'
import { DataSource, In, LessThan, MoreThan, Raw, Repository } from 'typeorm'

import { ProductCategory } from '@pengode/product-category/product-category'
import { Product, Status } from '@pengode/product/product'
import {
  CreateProductRequest,
  FindAllRequest,
  ProductResponse,
} from '@pengode/product/product.dto'
import { PageResponse } from '@pengode/common/dtos'

@Injectable()
export class ProductService {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(req: CreateProductRequest): Promise<ProductResponse> {
    const product = await this.dataSource.transaction(async (entityManager) => {
      const productRepository = entityManager.getRepository(Product)
      const productCategoryRepository =
        entityManager.getRepository(ProductCategory)

      const categories = await Promise.all(
        req.categoryIds.map(async (categoryId) => {
          const category = await productCategoryRepository.findOneBy({
            id: categoryId,
          })
          if (!category) {
            throw new NotFoundException(
              `category with id ${categoryId} is not found`,
            )
          }

          return category
        }),
      )

      const product = await productRepository.save({
        title: req.title,
        description: req.description,
        previewUrl: req.previewUrl,
        price: new Decimal(req.price),
        discount: req.discount,
        status: Status[req.status],
        totalRatings: 0,
        numberOfRatings: 0,
        numberOfReviewers: 0,
        categories,
      })

      return product
    })

    return ProductResponse.create(product)
  }

  async findAll(req: FindAllRequest): Promise<PageResponse<ProductResponse>> {
    const products = await this.productRepository.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),
        status: req.statuses ? In(req.statuses) : undefined,
        title: req.search
          ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
          : undefined,
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
    })

    return {
      items: products.map(ProductResponse.create),
      previousCursor: products[0]?.id || 0,
      nextCursor: products[products.length - 1]?.id || 0,
    }
  }

  async findById(productId: number): Promise<ProductResponse> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    })
    if (!product) {
      throw new NotFoundException('product is not found')
    }

    return ProductResponse.create(product)
  }
}
