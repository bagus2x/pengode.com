import { Test, TestingModule } from '@nestjs/testing'
import { ProductInvoiceItemService } from './product-invoice-item.service'

describe('ProductInvoiceItemService', () => {
  let service: ProductInvoiceItemService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductInvoiceItemService],
    }).compile()

    service = module.get<ProductInvoiceItemService>(ProductInvoiceItemService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
