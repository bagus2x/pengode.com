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
import { CategoryResponse } from '@pengode/article-category/article-category.dto'

import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { EveryRolesGuard } from '@pengode/auth/utils/roles-guard'
import { PageResponse } from '@pengode/common/dtos'
import {
  CreateCategoryRequest,
  FindAllRequest,
} from '@pengode/product-category/product-category.dto'
import { ProductCategoryService } from '@pengode/product-category/product-category.service'

@Controller()
@ApiTags('Product Category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post('/product-category')
  @UseGuards(AccessTokenGuard, EveryRolesGuard('ADMIN'))
  @HttpCode(201)
  @ApiOkResponse({ type: CategoryResponse })
  create(@Body() req: CreateCategoryRequest): Promise<CategoryResponse> {
    return this.productCategoryService.create(req)
  }

  @Get('/product-categories')
  @ApiOkResponse({ type: Array<CategoryResponse> })
  findAll(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<CategoryResponse>> {
    return this.productCategoryService.findAll(req)
  }

  @Get('/product-category/:categoryId')
  @ApiOkResponse({ type: CategoryResponse })
  findById(@Param('categoryId') categoryId: number): Promise<CategoryResponse> {
    return this.productCategoryService.findById(categoryId)
  }
}
