import { Module } from '@nestjs/common'

import { ProductLikeController } from '@pengode/product-like/product-like.controller'
import { ProductLikeService } from '@pengode/product-like/product-like.service'

@Module({
  controllers: [ProductLikeController],
  providers: [ProductLikeService],
})
export class ProductLikeModule {}
