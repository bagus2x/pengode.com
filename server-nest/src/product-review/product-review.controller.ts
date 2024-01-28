import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageResponse } from '@pengode/common/dtos'
import {
  CreateProductReviewRequest,
  FindAllRequest,
  ProductReviewResponse,
} from '@pengode/product-review/product-review.dto'

import { ProductReviewService } from '@pengode/product-review/product-review.service'
import { ClsService } from 'nestjs-cls'

@Controller()
@ApiTags('Product Review')
export class ProductReviewController {
  constructor(
    private readonly productReviewService: ProductReviewService,
    private readonly clsService: ClsService,
  ) {}

  @Post('/product-review')
  @UseGuards(AccessTokenGuard)
  @HttpCode(201)
  @ApiCreatedResponse({ type: ProductReviewResponse })
  create(
    @Body() req: CreateProductReviewRequest,
  ): Promise<ProductReviewResponse> {
    return this.productReviewService.create(req)
  }

  @Get('/user/product-reviews')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: PageResponse<ProductReviewResponse> })
  findByAuthUser(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<ProductReviewResponse>> {
    return this.productReviewService.findReviewsByReviewerId(
      this.clsService.get<number>('userId'),
      req,
    )
  }

  @Get('/product/:productId/product-reviews')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: PageResponse<ProductReviewResponse> })
  findByProductId(
    @Param('productId')
    productId: number,
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<ProductReviewResponse>> {
    return this.productReviewService.findReviewsByProductId(productId, req)
  }

  @Get('/product/:productId/product-review')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: ProductReviewResponse })
  findByAuthUserAndProductId(
    @Param('productId')
    productId: number,
  ): Promise<ProductReviewResponse> {
    return this.productReviewService.findByAuthUserAndProductId(productId)
  }
}
