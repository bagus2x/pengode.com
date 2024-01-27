import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageResponse } from '@pengode/common/dtos'
import {
  CreateLogRequest,
  FindAllRequest,
  LogResponse,
} from '@pengode/product-log/product-log.dto'
import { ProductLogService } from '@pengode/product-log/product-log.service'

@Controller()
@ApiTags('Product Log')
export class ProductLogController {
  constructor(private readonly productLogService: ProductLogService) {}

  @Post('/product-log')
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({ type: LogResponse })
  create(@Body() req: CreateLogRequest): Promise<LogResponse> {
    return this.productLogService.create(req)
  }

  @Get('/product-logs')
  @ApiOkResponse({ type: Array<LogResponse> })
  findAll(@Query() req: FindAllRequest): Promise<PageResponse<LogResponse>> {
    return this.productLogService.findAll(req)
  }

  @Put('/product-log/:logId')
  @ApiCreatedResponse({ type: LogResponse })
  update(
    @Param('logId') logId: number,
    @Body() req: CreateLogRequest,
  ): Promise<LogResponse> {
    return this.productLogService.update(logId, req)
  }
}
