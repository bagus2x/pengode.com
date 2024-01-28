import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { ProductReview } from '@pengode/product-review/product-review'

import { ProductReviewController } from '@pengode/product-review/product-review.controller'
import { ProductReviewService } from '@pengode/product-review/product-review.service'
import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductReview,
      User,
      Product,
      ProductInvoiceItem,
    ]),
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ProductReviewModule {}
