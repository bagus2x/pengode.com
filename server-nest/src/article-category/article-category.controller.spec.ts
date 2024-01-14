import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCategoryController } from './article-category.controller';
import { ArticleCategoryService } from './article-category.service';

describe('ArticleCategoryController', () => {
  let controller: ArticleCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleCategoryController],
      providers: [ArticleCategoryService],
    }).compile();

    controller = module.get<ArticleCategoryController>(ArticleCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
