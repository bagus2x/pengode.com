import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductCart } from '@pengode/product-cart/product-cart'
import { ProductCartController } from '@pengode/product-cart/product-cart.controller'
import { ProductCartService } from '@pengode/product-cart/product-cart.service'
import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCart, Product, User])],
  controllers: [ProductCartController],
  providers: [ProductCartService],
})
export class ProductCartModule {}
