import { ApiProperty } from '@nestjs/swagger'
import { PageRequest } from '@pengode/common/dtos'
import { Product, Status } from '@pengode/product/product'
import { Transform } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
  MaxLength,
  NotEquals,
} from 'class-validator'

export class CreateProductRequest {
  @IsNotEmpty()
  @MaxLength(255)
  title: string

  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  @IsUrl()
  previewUrl: string

  @IsDecimal()
  price: string

  @IsEnum(Status)
  status: Status

  @IsArray()
  @ArrayUnique()
  @IsPositive({ each: true })
  @NotEquals(null, { each: true })
  @NotEquals(undefined, { each: true })
  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty()
  categoryIds: number[] = []

  @IsNumber()
  @IsOptional()
  discount?: number | null
}

export class ProductLogResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  productUrl: string

  @ApiProperty()
  description: string

  @ApiProperty()
  createdAt: Date
}

export class CategoryResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string
}

export class ProductResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  previewUrl: string

  @ApiProperty()
  price: string

  @ApiProperty()
  status: Status

  @ApiProperty()
  discount?: number | null

  @ApiProperty()
  categories: CategoryResponse[]

  @ApiProperty()
  logs: ProductLogResponse[]

  static create(product: Product): ProductResponse {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      previewUrl: product.previewUrl,
      price: product.price.toString(),
      categories: product.categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
      logs: product.logs,
      status: product.status,
      discount: product.discount,
    }
  }
}

export class FindAllRequest extends PageRequest {
  @IsOptional()
  @ApiProperty()
  search?: string

  @IsArray()
  @IsOptional()
  @IsEnum(Status, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiProperty()
  statuses?: Status[]
}
