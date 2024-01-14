import { Test, TestingModule } from '@nestjs/testing'
import { ArticleHistoryService } from './article-history.service'

describe('ArticleHistoryService', () => {
  let service: ArticleHistoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleHistoryService],
    }).compile()

    service = module.get<ArticleHistoryService>(ArticleHistoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
