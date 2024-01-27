import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { FindAllRequest } from '@pengode/article-category/article-category.dto'
import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageResponse } from '@pengode/common/dtos'
import { HistoryResponse } from '@pengode/product-invoice-history/product-invoice-history.dto'
import { ProductInvoiceHistoryService } from '@pengode/product-invoice-history/product-invoice-history.service'

@Controller()
@ApiTags('Product Invoice History')
export class ProductInvoiceHistoryController {
  constructor(
    private readonly productInvoiceHistoryService: ProductInvoiceHistoryService,
  ) {}

  @Get('/product-invoice-histories')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: Array<HistoryResponse> })
  findAll(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<HistoryResponse>> {
    return this.productInvoiceHistoryService.findAll(req)
  }
}
