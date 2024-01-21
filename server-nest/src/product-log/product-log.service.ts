import { Injectable } from '@nestjs/common'
import { LessThan, MoreThan, Repository } from 'typeorm'

import { InjectRepository } from '@nestjs/typeorm'
import { PageResponse } from '@pengode/common/dtos'
import { ProductLog } from '@pengode/product-log/product-log'
import {
  FindAllRequest,
  LogResponse,
} from '@pengode/product-log/product-log.dto'
import { ProductLogResponse } from '@pengode/product/product.dto'

@Injectable()
export class ProductLogService {
  constructor(
    @InjectRepository(ProductLog)
    private readonly productLogRepository: Repository<ProductLogResponse>,
  ) {}

  async findAll(req: FindAllRequest): Promise<PageResponse<LogResponse>> {
    const logs = await this.productLogRepository.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
    })

    return {
      items: logs.map(LogResponse.create),
      previousCursor: logs[0]?.id || 0,
      nextCursor: logs[logs.length - 1]?.id || 0,
    }
  }
}
