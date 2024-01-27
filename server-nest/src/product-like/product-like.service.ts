import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClsService } from 'nestjs-cls'
import { DataSource, In, LessThan, MoreThan, Raw, Repository } from 'typeorm'

import { PageResponse } from '@pengode/common/dtos'
import { ProductLike } from '@pengode/product-like/product-like'
import { Product } from '@pengode/product/product'
import { FindAllRequest, ProductResponse } from '@pengode/product/product.dto'
import { User } from '@pengode/user/user'

@Injectable()
export class ProductLikeService {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
    private readonly clsService: ClsService,
    @InjectRepository(ProductLike)
    private readonly productLikeResponse: Repository<ProductLike>,
  ) {}

  async addLike(productId: number): Promise<ProductResponse> {
    const product = await this.dataSource.transaction(async (entityManager) => {
      const userRepository = entityManager.getRepository(User)
      const productRepository = entityManager.getRepository(Product)
      const productLikeRepository = entityManager.getRepository(ProductLike)

      const user = await userRepository.findOne({
        where: {
          id: this.clsService.get<number>('userId'),
        },
      })
      if (!user) {
        throw new NotFoundException('user is not found')
      }

      const product = await productRepository.findOne({
        where: { id: productId },
      })
      if (!product) {
        throw new NotFoundException('product is not found')
      }

      product.numberOfLikes += 1

      await productRepository.save(product)

      await productLikeRepository.save({
        user,
        product,
      })

      return product
    })

    return ProductResponse.create(product)
  }

  async findLikedProducts(
    req: FindAllRequest,
  ): Promise<PageResponse<ProductResponse>> {
    const productLikes = await this.productLikeResponse.find({
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
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
      relations: {
        product: {
          categories: true,
          owner: true,
          logs: true,
        },
      },
    })

    return {
      items: productLikes.map(({ product }) => ProductResponse.create(product)),
      previousCursor: productLikes[0]?.id || 0,
      nextCursor: productLikes[productLikes.length - 1]?.id || 0,
    }
  }

  async removeLike(productId: number): Promise<ProductResponse> {
    const product = await this.dataSource.transaction(async (entityManager) => {
      const userRepository = entityManager.getRepository(User)
      const productRepository = entityManager.getRepository(Product)
      const productLikeRepository = entityManager.getRepository(ProductLike)

      const user = await userRepository.findOne({
        where: {
          id: this.clsService.get<number>('userId'),
        },
      })
      if (!user) {
        throw new NotFoundException('user is not found')
      }

      const product = await productRepository.findOne({
        where: { id: productId },
      })
      if (!product) {
        throw new NotFoundException('product is not found')
      }

      const productLike = await productLikeRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
          product: {
            id: product.id,
          },
        },
      })
      if (!productLike) {
        throw new NotFoundException('product is not found')
      }

      if (product.numberOfLikes > 0) {
        product.numberOfLikes -= 1

        await productRepository.save(product)

        await productLikeRepository.remove(productLike)
      }

      return product
    })

    return ProductResponse.create(product)
  }
}
