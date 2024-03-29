import { ApiProperty } from '@nestjs/swagger'
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

import { PageRequest } from '@pengode/common/dtos'
import { CategoryResponse } from '@pengode/product-category/product-category.dto'
import { LogResponse } from '@pengode/product-log/product-log.dto'
import { Product, Status } from '@pengode/product/product'
import { UserResponse } from '@pengode/user/user.dto'

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

  @IsNumber()
  @IsOptional()
  discount?: number | null

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
}

export class UpdateProductRequest extends CreateProductRequest {}

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
  owner: UserResponse

  @ApiProperty()
  logs: Omit<LogResponse, 'product'>[]

  @ApiProperty()
  numberOfOneStars: number

  @ApiProperty()
  numberOfTwoStars: number

  @ApiProperty()
  numberOfThreeStars: number

  @ApiProperty()
  numberOfFourStars: number

  @ApiProperty()
  numberOfFiveStars: number

  @ApiProperty()
  numberOfBuyers: number

  @ApiProperty()
  numberOfLikes: number

  @ApiProperty()
  liked?: boolean

  @ApiProperty()
  paid?: boolean

  @ApiProperty()
  createdAt: Date

  static create(
    product: Product & { liked?: boolean; paid?: boolean },
  ): ProductResponse {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      previewUrl: product.previewUrl,
      price: product.price.toString(),
      categories: product.categories
        ? product.categories.map(CategoryResponse.create)
        : undefined,
      status: product.status,
      discount: product.discount,
      owner: product.owner ? UserResponse.create(product.owner) : undefined,
      logs: product.logs ? product.logs.map(LogResponse.create) : undefined,
      numberOfOneStars: product.numberOfOneStars,
      numberOfTwoStars: product.numberOfTwoStars,
      numberOfThreeStars: product.numberOfThreeStars,
      numberOfFourStars: product.numberOfFourStars,
      numberOfFiveStars: product.numberOfFiveStars,
      numberOfBuyers: product.numberOfBuyers,
      numberOfLikes: product.numberOfLikes,
      liked: product.liked,
      paid: product.paid,
      createdAt: product.createdAt,
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
