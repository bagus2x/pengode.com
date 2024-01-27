import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Decimal from 'decimal.js'
import { ClsService } from 'nestjs-cls'
import { DataSource, In, LessThan, MoreThan, Raw, Repository } from 'typeorm'

import { PageResponse } from '@pengode/common/dtos'
import { ProductCategory } from '@pengode/product-category/product-category'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { Status as InvoiceStatus } from '@pengode/product-invoice/product-invoice'
import { Product, Status } from '@pengode/product/product'
import {
  CreateProductRequest,
  FindAllRequest,
  ProductResponse,
  UpdateProductRequest,
} from '@pengode/product/product.dto'
import { User } from '@pengode/user/user'

@Injectable()
export class ProductService {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductInvoiceItem)
    private readonly productInvoiceItemRepository: Repository<ProductInvoiceItem>,
    private readonly clsService: ClsService,
  ) {}

  async create(req: CreateProductRequest): Promise<ProductResponse> {
    const product = await this.dataSource.transaction(async (entityManager) => {
      const productRepository = entityManager.getRepository(Product)
      const productCategoryRepository =
        entityManager.getRepository(ProductCategory)
      const userRepository = entityManager.getRepository(User)

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

      const owner = await userRepository.findOne({
        where: { id: this.clsService.get<number>('userId') },
      })
      if (!owner) {
        throw new NotFoundException('owner is not found')
      }

      const product = await productRepository.save({
        title: req.title,
        description: req.description,
        previewUrl: req.previewUrl,
        price: new Decimal(req.price),
        discount: req.discount,
        status: Status[req.status],
        totalRatings: 0,
        numberOfRatings: 0,
        numberOfBuyers: 0,
        categories,
        owner,
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
      relations: {
        categories: true,
        owner: true,
        logs: true,
      },
    })

    return {
      items: products.map(ProductResponse.create),
      previousCursor: products[0]?.id || 0,
      nextCursor: products[products.length - 1]?.id || 0,
    }
  }

  async findBoughtProducts(
    req: FindAllRequest,
  ): Promise<PageResponse<ProductResponse>> {
    const invoiceItems = await this.productInvoiceItemRepository.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),
        product: {
          status: req.statuses ? In(req.statuses) : undefined,
          title: req.search
            ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
            : undefined,
        },
        invoice: {
          status: InvoiceStatus.PAID,
          customer: {
            id: this.clsService.get<number>('userId'),
          },
        },
      },
      relations: {
        product: {
          owner: true,
        },
      },
    })

    return {
      items: invoiceItems.map((item) => ProductResponse.create(item.product)),
      previousCursor: invoiceItems[0]?.id || 0,
      nextCursor: invoiceItems[invoiceItems.length - 1]?.id || 0,
    }
  }

  async findById(productId: number): Promise<ProductResponse> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: {
        categories: true,
        owner: true,
        logs: true,
      },
    })
    if (!product) {
      throw new NotFoundException('product is not found')
    }

    return ProductResponse.create(product)
  }

  async update(
    productId: number,
    req: UpdateProductRequest,
  ): Promise<ProductResponse> {
    const product = await this.dataSource.transaction(async (entityManager) => {
      const productRepository = entityManager.getRepository(Product)
      const productCategoryRepository =
        entityManager.getRepository(ProductCategory)

      const product = await productRepository.findOne({
        where: { id: productId },
      })
      if (!product) {
        throw new NotFoundException('product is not found')
      }

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

      product.title = req.title
      product.description = req.description
      product.previewUrl = req.previewUrl
      product.price = new Decimal(req.price)
      product.discount = req.discount
      product.status = Status[req.status]
      product.categories = categories

      return await productRepository.save(product)
    })

    return ProductResponse.create(product)
  }
}
