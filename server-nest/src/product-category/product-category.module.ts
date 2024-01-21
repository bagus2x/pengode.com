import { Module } from '@nestjs/common'
import { ProductCategoryService } from './product-category.service'
import { ProductCategoryController } from './product-category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductCategory } from '@pengode/product-category/product-category'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}
