import { Test, TestingModule } from '@nestjs/testing'
import { ProductLogController } from './product-log.controller'
import { ProductLogService } from './product-log.service'

describe('ProductLogController', () => {
  let controller: ProductLogController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductLogController],
      providers: [ProductLogService],
    }).compile()

    controller = module.get<ProductLogController>(ProductLogController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
