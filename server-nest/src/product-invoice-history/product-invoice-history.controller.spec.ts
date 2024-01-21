import { Test, TestingModule } from '@nestjs/testing'
import { ProductInvoiceHistoryController } from './product-invoice-history.controller'
import { ProductInvoiceHistoryService } from './product-invoice-history.service'

describe('ProductInvoiceHistoryController', () => {
  let controller: ProductInvoiceHistoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductInvoiceHistoryController],
      providers: [ProductInvoiceHistoryService],
    }).compile()

    controller = module.get<ProductInvoiceHistoryController>(
      ProductInvoiceHistoryController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
