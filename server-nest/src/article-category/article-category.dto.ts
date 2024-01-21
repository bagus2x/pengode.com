import { ApiProperty } from '@nestjs/swagger'
import { ArticleCategory } from '@pengode/article-category/article-category'
import { PageRequest } from '@pengode/common/dtos'
import { IsOptional } from 'class-validator'

export class CreateCategoryRequest {
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

  static create(category: ArticleCategory): CategoryResponse {
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
