import { Injectable } from '@nestjs/common'
import { In, LessThan, MoreThan, Repository } from 'typeorm'

import { PageResponse } from '@pengode/common/dtos'
import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'
import {
  FindAllRequest,
  HistoryResponse,
} from '@pengode/product-invoice-history/product-invoice-history.dto'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ProductInvoiceHistoryService {
  constructor(
    @InjectRepository(ProductInvoiceHistory)
    private readonly productInvoiceHistoryResponse: Repository<ProductInvoiceHistory>,
  ) {}

  async findAll(req: FindAllRequest): Promise<PageResponse<HistoryResponse>> {
    const products = await this.productInvoiceHistoryResponse.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),
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
      previousCursor: products[0]?.id || 0,
      nextCursor: products[products.length - 1]?.id || 0,
    }
  }
}
