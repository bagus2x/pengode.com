import { Module } from '@nestjs/common'
import { ArticleCategoryService } from './article-category.service'
import { ArticleCategoryController } from './article-category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleCategory } from '@pengode/article-category/article-category'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleCategory])],
  controllers: [ArticleCategoryController],
  providers: [ArticleCategoryService],
})
export class ArticleCategoryModule {}
