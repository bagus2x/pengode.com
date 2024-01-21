import { Test, TestingModule } from '@nestjs/testing'
import { ProductInvoiceController } from './product-invoice.controller'
import { ProductInvoiceService } from './product-invoice.service'

describe('ProductInvoiceController', () => {
  let controller: ProductInvoiceController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductInvoiceController],
      providers: [ProductInvoiceService],
    }).compile()

    controller = module.get<ProductInvoiceController>(ProductInvoiceController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
