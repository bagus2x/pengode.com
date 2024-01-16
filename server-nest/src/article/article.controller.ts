import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  ArticleResponse,
  CreateArticleRequest,
  ScheduleArticleRequest,
  UpdateArticleRequest,
} from '@pengode/article/article.dto'
import { ArticleService } from '@pengode/article/article.service'
import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageParam, PageRequest, PageResponse } from '@pengode/common/dtos'

@Controller()
@ApiTags('Article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('/article')
  @UseGuards(AccessTokenGuard)
  @HttpCode(201)
  @ApiCreatedResponse({ type: ArticleResponse })
  create(@Body() req: CreateArticleRequest): Promise<ArticleResponse> {
    return this.articleService.create(req)
  }

  @Get('/articles')
  @HttpCode(200)
  @ApiOkResponse({ type: PageResponse<ArticleResponse> })
  findAll(
    @PageParam() req: PageRequest,
  ): Promise<PageResponse<ArticleResponse>> {
    return this.articleService.findAll(req)
  }

  @Get('/article/:articleId')
  @HttpCode(200)
  @ApiOkResponse({ type: ArticleResponse })
  findOne(@Param('articleId') articleId: string): Promise<ArticleResponse> {
    return this.articleService.findOne(+articleId)
  }

  @Patch('/article/:articleId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @ApiOkResponse({ type: ArticleResponse })
  update(
    @Param('articleId') articleId: string,
    @Body() req: UpdateArticleRequest,
  ): Promise<ArticleResponse> {
    return this.articleService.update(+articleId, req)
  }

  @Patch('/article/:articleId/draft')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @ApiOkResponse({ type: ArticleResponse })
  draft(@Param('articleId') articleId: string): Promise<ArticleResponse> {
    return this.articleService.draft(+articleId)
  }

  @Patch('/article/:articleId/publish')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @ApiOkResponse({ type: ArticleResponse })
  publish(@Param('articleId') articleId: string): Promise<ArticleResponse> {
    return this.articleService.publish(+articleId)
  }

  @Patch('/article/:articleId/schedule')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @ApiOkResponse({ type: ArticleResponse })
  schedule(
    @Param('articleId') articleId: string,
    @Body() req: ScheduleArticleRequest,
  ): Promise<ArticleResponse> {
    return this.articleService.schedule(+articleId, req)
  }

  @Delete('/article/:articleId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @ApiOkResponse({ type: ArticleResponse })
  remove(@Param('articleId') articleId: string): Promise<ArticleResponse> {
    return this.articleService.remove(+articleId)
  }
}
