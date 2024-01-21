import { Controller, Get, Query } from '@nestjs/common'
import { ProductInvoiceHistoryService } from './product-invoice-history.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FindAllRequest } from '@pengode/article-category/article-category.dto'
import { HistoryResponse } from '@pengode/product-invoice-history/product-invoice-history.dto'
import { PageResponse } from '@pengode/common/dtos'

@Controller()
@ApiTags('Product Invoice History')
export class ProductInvoiceHistoryController {
  constructor(
    private readonly productInvoiceHistoryService: ProductInvoiceHistoryService,
  ) {}

  @Get('/product-invoice-histories')
  @ApiOkResponse({ type: Array<HistoryResponse> })
  findAll(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<HistoryResponse>> {
    return this.productInvoiceHistoryService.findAll(req)
  }
}
