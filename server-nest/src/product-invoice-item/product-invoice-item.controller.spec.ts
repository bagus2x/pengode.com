import { Test, TestingModule } from '@nestjs/testing'
import { ProductInvoiceItemController } from './product-invoice-item.controller'
import { ProductInvoiceItemService } from './product-invoice-item.service'

describe('ProductInvoiceItemController', () => {
  let controller: ProductInvoiceItemController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductInvoiceItemController],
      providers: [ProductInvoiceItemService],
    }).compile()

    controller = module.get<ProductInvoiceItemController>(
      ProductInvoiceItemController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
