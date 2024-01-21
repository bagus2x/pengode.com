import { Injectable } from '@nestjs/common'
import { In, LessThan, Repository } from 'typeorm'

import { PageResponse } from '@pengode/common/dtos'
import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'
import {
  FindAllRequest,
  HistoryResponse,
} from '@pengode/product-invoice-history/product-invoice-history.dto'

@Injectable()
export class ProductInvoiceHistoryService {
  constructor(
    private readonly productInvoiceHistoryResponse: Repository<ProductInvoiceHistory>,
  ) {}

  async findAll(req: FindAllRequest): Promise<PageResponse<HistoryResponse>> {
    const products = await this.productInvoiceHistoryResponse.find({
      where: {
        id: LessThan(req.cursor),
        invoice: {
          id: req.invoiceIds ? In(req.invoiceIds) : undefined,
        },
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
    })

    return {
      items: products.map(HistoryResponse.create),
      nextCursor: products[products.length - 1]?.id || 0,
    }
  }
}
