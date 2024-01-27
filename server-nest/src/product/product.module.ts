import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductCategory } from '@pengode/product-category/product-category'
import { Product } from '@pengode/product/product'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { ProductController } from '@pengode/product/product.controller'
import { ProductService } from '@pengode/product/product.service'
import { ProductLike } from '@pengode/product-like/product-like'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategory,
      ProductInvoiceItem,
      ProductLike,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
