import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageResponse } from '@pengode/common/dtos'
import { ProductLikeService } from '@pengode/product-like/product-like.service'
import { FindAllRequest, ProductResponse } from '@pengode/product/product.dto'

@Controller()
@ApiTags('Product')
export class ProductLikeController {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @Patch('/product/:productId/like')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: ProductResponse })
  addLike(@Param('productId') productId: number): Promise<ProductResponse> {
    return this.productLikeService.addLike(productId)
  }

  @Get('/user/liked-products')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: PageResponse<ProductResponse> })
  findLikedProducts(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<ProductResponse>> {
    return this.productLikeService.findLikedProducts(req)
  }

  @Delete('/product/:productId/like')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: ProductResponse })
  removeLike(@Param('productId') productId: number): Promise<ProductResponse> {
    return this.productLikeService.removeLike(productId)
  }
}
