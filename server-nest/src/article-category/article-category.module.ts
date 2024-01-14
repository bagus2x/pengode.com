import { Module } from '@nestjs/common';
import { ArticleCategoryService } from './article-category.service';
import { ArticleCategoryController } from './article-category.controller';

@Module({
  controllers: [ArticleCategoryController],
  providers: [ArticleCategoryService],
})
export class ArticleCategoryModule {}
