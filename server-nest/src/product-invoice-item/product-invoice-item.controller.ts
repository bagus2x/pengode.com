import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AccessTokenGuard } from '@pengode/auth/utils/access-token-guard'
import { PageResponse } from '@pengode/common/dtos'
import {
  FindAllRequest,
  ItemResponse,
} from '@pengode/product-invoice-item/product-invoice-item.dto'
import { ProductInvoiceItemService } from '@pengode/product-invoice-item/product-invoice-item.service'

@Controller()
@ApiTags('Product Invoice Item')
export class ProductInvoiceItemController {
  constructor(
    private readonly productInvoiceItemService: ProductInvoiceItemService,
  ) {}

  @Get('/product-invoice-items')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: Array<ItemResponse> })
  findAll(@Query() req: FindAllRequest): Promise<PageResponse<ItemResponse>> {
    return this.productInvoiceItemService.findAll(req)
  }
}
