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
  CreateInvoiceRequest,
  FindAllRequest,
  InvoiceResponse,
  ListenNotificationRequest,
} from '@pengode/product-invoice/product-invoice.dto'
import { ProductInvoiceService } from '@pengode/product-invoice/product-invoice.service'

@Controller()
@ApiTags('Product Invoice')
export class ProductInvoiceController {
  constructor(private readonly productInvoiceService: ProductInvoiceService) {}

  @Post('/product-invoice')
  @UseGuards(AccessTokenGuard, EveryRolesGuard('ADMIN'))
  @HttpCode(201)
  @ApiOkResponse({ type: InvoiceResponse })
  create(@Body() req: CreateInvoiceRequest): Promise<InvoiceResponse> {
    return this.productInvoiceService.create(req)
  }

  @Get('/product-invoices')
  @ApiOkResponse({ type: Array<InvoiceResponse> })
  findAll(
    @Query() req: FindAllRequest,
  ): Promise<PageResponse<InvoiceResponse>> {
    return this.productInvoiceService.findAll(req)
  }

  @Get('/product-invoice/:invoiceId')
  @ApiOkResponse({ type: InvoiceResponse })
  findById(@Param('invoiceId') invoiceId: number): Promise<InvoiceResponse> {
    return this.productInvoiceService.findById(invoiceId)
  }

  @Post('/product-invoice/notification')
  @ApiOkResponse({ type: InvoiceResponse })
  listenNotification(
    @Body() req: ListenNotificationRequest,
  ): Promise<InvoiceResponse> {
    return this.productInvoiceService.listenNotifications(req)
  }
}
