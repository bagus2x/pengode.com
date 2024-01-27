import { Test, TestingModule } from '@nestjs/testing'

import { ProductLikeController } from '@pengode/product-like/product-like.controller'
import { ProductLikeService } from '@pengode/product-like/product-like.service'

describe('ProductLikeController', () => {
  let controller: ProductLikeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductLikeController],
      providers: [ProductLikeService],
    }).compile()

    controller = module.get<ProductLikeController>(ProductLikeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
