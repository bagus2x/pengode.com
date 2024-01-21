import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { PageResponse } from '@pengode/common/dtos'
import {
  FindAllRequest,
  LogResponse,
} from '@pengode/product-log/product-log.dto'
import { ProductLogService } from './product-log.service'

@Controller()
@ApiTags('Product Log')
export class ProductLogController {
  constructor(private readonly productLogService: ProductLogService) {}

  @Get('/product-logs')
  @ApiOkResponse({ type: Array<LogResponse> })
  findAll(@Query() req: FindAllRequest): Promise<PageResponse<LogResponse>> {
    return this.productLogService.findAll(req)
  }
}
