import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCategory } from '@pengode/product-category/product-category'
import { Product } from '@pengode/product/product'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
