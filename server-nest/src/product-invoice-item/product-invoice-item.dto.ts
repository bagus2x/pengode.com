import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional } from 'class-validator'

import { PageRequest } from '@pengode/common/dtos'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { ProductResponse } from '@pengode/product/product.dto'

export class ItemResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  product: Pick<
    ProductResponse,
    'id' | 'title' | 'previewUrl' | 'price' | 'discount'
  >

  @ApiProperty()
  price: string

  @ApiProperty()
  discount?: number | null

  @ApiProperty()
  createdAt: Date

  static create(item: ProductInvoiceItem): ItemResponse {
    return {
      id: item.id,
      price: item.price.toString(),
      discount: item.discount,
      product: {
        id: item.id,
        title: item.product.title,
        previewUrl: item.product.previewUrl,
        price: item.product.price.toString(),
        discount: item.product.discount,
      },
      createdAt: item.createdAt,
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
