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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { EveryRolesGuard } from '@pengode/auth/utils/roles-guard'
import { PageResponse } from '@pengode/common/dtos'
import {
  CreateProductRequest,
  FindAllRequest,
  ProductResponse,
} from '@pengode/product/product.dto'
import { ProductService } from './product.service'

@Controller()
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/product')
  @UseGuards(AccessTokenGuard, EveryRolesGuard('ADMIN'))
  @HttpCode(201)
  @ApiOkResponse({ type: ProductResponse })
  create(@Body() req: CreateProductRequest): Promise<ProductResponse> {
    return this.productService.create(req)
  }

  @Get('/products')
  @ApiOkResponse({ type: Array<ProductResponse> })
  findAll(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<ProductResponse>> {
    return this.productService.findAll(req)
  }

  @Get('/product/:productId')
  @ApiOkResponse({ type: ProductResponse })
  findById(@Param('productId') productId: number): Promise<ProductResponse> {
    return this.productService.findById(productId)
  }
}
