import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PageResponse } from '@pengode/common/dtos'
import { In, LessThan, MoreThan, Repository } from 'typeorm'

import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { FindAllRequest } from '@pengode/product-invoice-item/product-invoice-item.dto'
import { ItemResponse } from '@pengode/product-invoice/product-invoice.dto'

@Injectable()
export class ProductInvoiceItemService {
  constructor(
    @InjectRepository(ProductInvoiceItem)
    private readonly productInvoiceItemRepository: Repository<ProductInvoiceItem>,
  ) {}

  async findAll(req: FindAllRequest): Promise<PageResponse<ItemResponse>> {
    const products = await this.productInvoiceItemRepository.find({
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
      items: products.map(ItemResponse.create),
      previousCursor: products[0]?.id || 0,
      nextCursor: products[products.length - 1]?.id || 0,
    }
  }
}
