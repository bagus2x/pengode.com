import { Test, TestingModule } from '@nestjs/testing'
import { ProductLogService } from './product-log.service'

describe('ProductLogService', () => {
  let service: ProductLogService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductLogService],
    }).compile()

    service = module.get<ProductLogService>(ProductLogService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
