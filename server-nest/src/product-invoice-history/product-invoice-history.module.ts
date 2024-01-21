import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'
import { ProductInvoiceHistoryController } from './product-invoice-history.controller'
import { ProductInvoiceHistoryService } from './product-invoice-history.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProductInvoiceHistory])],
  controllers: [ProductInvoiceHistoryController],
  providers: [ProductInvoiceHistoryService],
})
export class ProductInvoiceHistoryModule {}
