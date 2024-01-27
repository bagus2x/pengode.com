import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageResponse } from '@pengode/common/dtos'
import { AddProductRequest } from '@pengode/product-cart/product-cart.dto'
import { ProductCartService } from '@pengode/product-cart/product-cart.service'
import { FindAllRequest, ProductResponse } from '@pengode/product/product.dto'

@Controller()
@ApiTags('Product Cart')
export class ProductCartController {
  constructor(private readonly productCartService: ProductCartService) {}

  @Post('/product-cart')
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({ type: ProductResponse })
  add(@Body() req: AddProductRequest): Promise<ProductResponse> {
    return this.productCartService.add(req)
  }

  @Get('/product-cart')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: PageResponse<ProductResponse> })
  findAll(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<ProductResponse>> {
    return this.productCartService.findAll(req)
  }

  @Delete('/product-cart/:productId')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: ProductResponse })
  remove(@Param('productId') productId: number): Promise<ProductResponse> {
    return this.productCartService.remove(productId)
  }
}
