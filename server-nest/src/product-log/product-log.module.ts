import { Module } from '@nestjs/common'
import { ProductLogService } from './product-log.service'
import { ProductLogController } from './product-log.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductLog } from '@pengode/product-log/product-log'

@Module({
  imports: [TypeOrmModule.forFeature([ProductLog])],
  controllers: [ProductLogController],
  providers: [ProductLogService],
})
export class ProductLogModule {}
