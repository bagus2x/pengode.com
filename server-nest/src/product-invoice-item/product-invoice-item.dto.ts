import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional } from 'class-validator'

import { PageRequest } from '@pengode/common/dtos'

export class ProductResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  title: string

  @ApiProperty()
  previewUrl: string

  @ApiProperty()
  price: string

  @ApiProperty()
  discount?: number | null
}

export class CustomerResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

  @ApiProperty()
  name: string

  @ApiProperty()
  photo: string
}

export class ItemResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  product: ProductResponse

  @ApiProperty()
  price: string

  @ApiProperty()
  discount?: number | null

  @ApiProperty()
  createdAt: Date
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
