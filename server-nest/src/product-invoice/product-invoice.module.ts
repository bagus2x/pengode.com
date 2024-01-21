import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { ProductInvoice } from '@pengode/product-invoice/product-invoice'
import { ProductInvoiceController } from '@pengode/product-invoice/product-invoice.controller'
import { ProductInvoiceService } from '@pengode/product-invoice/product-invoice.service'
import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductInvoice,
      Product,
      ProductInvoiceItem,
      ProductInvoiceHistory,
      User,
    ]),
  ],
  controllers: [ProductInvoiceController],
  providers: [ProductInvoiceService],
})
export class ProductInvoiceModule {}
