import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PageResponse } from '@pengode/common/dtos'
import { ProductCart } from '@pengode/product-cart/product-cart'
import { AddProductRequest } from '@pengode/product-cart/product-cart.dto'
import { Product } from '@pengode/product/product'
import { FindAllRequest, ProductResponse } from '@pengode/product/product.dto'
import { User } from '@pengode/user/user'
import { ClsService } from 'nestjs-cls'
import { In, LessThan, MoreThan, Raw, Repository } from 'typeorm'

@Injectable()
export class ProductCartService {
  constructor(
    private readonly cls: ClsService,
    @InjectRepository(ProductCart)
    private readonly productCartRepository: Repository<ProductCart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async add(req: AddProductRequest): Promise<ProductResponse> {
    const customer = await this.userRepository.findOne({
      where: { id: this.cls.get<number>('userId') },
    })
    if (!customer) {
      throw new NotFoundException('customer is not found')
    }

    const product = await this.productRepository.findOne({
      where: { id: req.productId },
    })
    if (!product) {
      throw new NotFoundException('product is not found')
    }

    const exists = await this.productCartRepository.existsBy({
      customer: { id: customer.id },
      product: { id: product.id },
    })
    if (exists) {
      throw new ConflictException('Product already exists in the cart')
    }

    const productCart = await this.productCartRepository.save({
      customer,
      product,
    })

    return ProductResponse.create(productCart.product)
  }

  async findAll(req: FindAllRequest): Promise<PageResponse<ProductResponse>> {
    const cart = await this.productCartRepository.find({
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
        product: true,
        customer: true,
      },
    })

    return {
      items: cart.map(({ product }) => ProductResponse.create(product)),
      previousCursor: cart[0]?.id || 0,
      nextCursor: cart[cart.length - 1]?.id || 0,
    }
  }

  async remove(productId: number): Promise<ProductResponse> {
    const productCart = await this.productCartRepository.findOne({
      where: {
        product: {
          id: productId,
        },
        customer: {
          id: this.cls.get<number>('productId'),
        },
      },
      relations: {
        product: true,
      },
    })

    await this.productCartRepository.remove(productCart)

    return ProductResponse.create(productCart.product)
  }
}
