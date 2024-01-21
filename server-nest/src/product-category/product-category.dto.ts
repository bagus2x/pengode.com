import { ApiProperty } from '@nestjs/swagger'
import { PageRequest } from '@pengode/common/dtos'
import { ProductCategory } from '@pengode/product-category/product-category'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class CreateCategoryRequest {
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty()
  name: string
}

export class CategoryResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  static create(category: ProductCategory): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}

export class FindAllRequest extends PageRequest {
  @IsOptional()
  @ApiProperty()
  search?: string
}
