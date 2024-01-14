import { Test, TestingModule } from '@nestjs/testing'
import { ArticleService } from './article.service'
import { AuthUser } from '@pengode/auth/utils/auth-user'

describe('ArticleService', () => {
  let service: ArticleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthUser, ArticleService],
    }).compile()

    service = module.get<ArticleService>(ArticleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('log', () => {
    expect(1).toEqual(2)
  })
})
