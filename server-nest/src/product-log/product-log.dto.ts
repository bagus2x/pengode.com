import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator'

import { PageRequest } from '@pengode/common/dtos'
import { ProductLog } from '@pengode/product-log/product-log'
import { ProductResponse } from '@pengode/product/product.dto'

export class CreateLogRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  name: string

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  productUrl: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  productId: number
}

export class UpdateLogRequest extends CreateLogRequest {}

export class LogResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  productUrl: string

  @ApiProperty()
  description: string

  @ApiProperty()
  product?: ProductResponse

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  static create(log: ProductLog): LogResponse {
    return {
      id: log.id,
      name: log.name,
      product: log.product ? ProductResponse.create(log.product) : undefined,
      description: log.description,
      productUrl: log.productUrl,
      createdAt: log.createdAt,
      updatedAt: log.createdAt,
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
  productIds?: number[]
}
