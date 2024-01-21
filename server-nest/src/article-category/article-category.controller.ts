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

import {
  CategoryResponse,
  CreateCategoryRequest,
  FindAllRequest,
} from '@pengode/article-category/article-category.dto'
import { ArticleCategoryService } from '@pengode/article-category/article-category.service'
import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { EveryRolesGuard } from '@pengode/auth/utils/roles-guard'
import { PageResponse } from '@pengode/common/dtos'

@Controller()
@ApiTags('Article Category')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Post('/article-category')
  @UseGuards(AccessTokenGuard, EveryRolesGuard('ADMIN'))
  @HttpCode(201)
  @ApiOkResponse({ type: CategoryResponse })
  create(@Body() req: CreateCategoryRequest): Promise<CategoryResponse> {
    return this.articleCategoryService.create(req)
  }

  @Get('/article-categories')
  @ApiOkResponse({ type: Array<CategoryResponse> })
  findAll(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<CategoryResponse>> {
    return this.articleCategoryService.findAll(req)
  }

  @Get('/article-category/:categoryId')
  @ApiOkResponse({ type: CategoryResponse })
  findById(@Param('categoryId') categoryId: number): Promise<CategoryResponse> {
    return this.articleCategoryService.findById(categoryId)
  }
}
