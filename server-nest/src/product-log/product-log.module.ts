import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductLog } from '@pengode/product-log/product-log'
import { ProductLogController } from '@pengode/product-log/product-log.controller'
import { ProductLogService } from '@pengode/product-log/product-log.service'
import { Product } from '@pengode/product/product'

@Module({
  imports: [TypeOrmModule.forFeature([ProductLog, Product])],
  controllers: [ProductLogController],
  providers: [ProductLogService],
})
export class ProductLogModule {}
