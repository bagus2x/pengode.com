import { Test, TestingModule } from '@nestjs/testing'

import { ProductLikeService } from '@pengode/product-like/product-like.service'

describe('ProductLikeService', () => {
  let service: ProductLikeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductLikeService],
    }).compile()

    service = module.get<ProductLikeService>(ProductLikeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
