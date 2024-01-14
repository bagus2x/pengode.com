import { Controller } from '@nestjs/common';
import { ArticleCategoryService } from './article-category.service';

@Controller('article-category')
export class ArticleCategoryController {
  constructor(private readonly articleCategoryService: ArticleCategoryService) {}
}
