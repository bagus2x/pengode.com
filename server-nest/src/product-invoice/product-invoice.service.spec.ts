import { Test, TestingModule } from '@nestjs/testing'
import { ProductInvoiceService } from './product-invoice.service'

describe('ProductInvoiceService', () => {
  let service: ProductInvoiceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductInvoiceService],
    }).compile()

    service = module.get<ProductInvoiceService>(ProductInvoiceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
