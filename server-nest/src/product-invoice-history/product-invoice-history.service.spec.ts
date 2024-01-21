import { Test, TestingModule } from '@nestjs/testing'
import { ProductInvoiceHistoryService } from './product-invoice-history.service'

describe('ProductInvoiceHistoryService', () => {
  let service: ProductInvoiceHistoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductInvoiceHistoryService],
    }).compile()

    service = module.get<ProductInvoiceHistoryService>(
      ProductInvoiceHistoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
