import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { ProductInvoiceItemController } from '@pengode/product-invoice-item/product-invoice-item.controller'
import { ProductInvoiceItemService } from '@pengode/product-invoice-item/product-invoice-item.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProductInvoiceItem])],
  controllers: [ProductInvoiceItemController],
  providers: [ProductInvoiceItemService],
})
export class ProductInvoiceItemModule {}
