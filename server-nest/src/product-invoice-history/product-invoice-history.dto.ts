import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional } from 'class-validator'

import { PageRequest } from '@pengode/common/dtos'
import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'
import { Status } from '@pengode/product-invoice/product-invoice'

export class HistoryResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  status: Status

  @ApiProperty()
  invoiceId: number

  @ApiProperty()
  createdAt: Date

  static create(history: ProductInvoiceHistory): HistoryResponse {
    return {
      id: history.id,
      status: history.status,
      invoiceId: history.invoice.id,
      createdAt: history.createdAt,
    }
  }
}

export class FindAllRequest extends PageRequest {
  @Type(() => Number)
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiProperty()
  invoiceIds?: number[]
}
