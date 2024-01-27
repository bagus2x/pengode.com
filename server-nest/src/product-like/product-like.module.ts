import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductLike } from '@pengode/product-like/product-like'
import { ProductLikeController } from '@pengode/product-like/product-like.controller'
import { ProductLikeService } from '@pengode/product-like/product-like.service'
import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'

@Module({
  imports: [TypeOrmModule.forFeature([ProductLike, User, Product])],
  controllers: [ProductLikeController],
  providers: [ProductLikeService],
})
export class ProductLikeModule {}
