import { Test, TestingModule } from '@nestjs/testing'
import { ArticleHistoryController } from './article-history.controller'
import { ArticleHistoryService } from './article-history.service'

describe('ArticleHistoryController', () => {
  let controller: ArticleHistoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleHistoryController],
      providers: [ArticleHistoryService],
    }).compile()

    controller = module.get<ArticleHistoryController>(ArticleHistoryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
