import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator'

import { PageRequest } from '@pengode/common/dtos'
import { ProductReview } from '@pengode/product-review/product-review'
import { ProductResponse } from '@pengode/product/product.dto'
import { UserResponse } from '@pengode/user/user.dto'

export class ProductReviewResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  reviewer: UserResponse

  @ApiProperty()
  product: ProductResponse

  @ApiProperty()
  description: string

  @ApiProperty()
  star: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  static create(review: ProductReview): ProductReviewResponse {
    return {
      id: review.id,
      reviewer: UserResponse.create(review.reviewer),
      product: ProductResponse.create(review.product),
      star: review.star,
      description: review.description,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }
  }
}

export class CreateProductReviewRequest {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  productId: number

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string | null

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  @ApiProperty()
  star: number
}

export class FindAllRequest extends PageRequest {
  @IsOptional()
  @ApiProperty()
  search?: string
}
