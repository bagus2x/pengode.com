import { Injectable } from '@nestjs/common'
import { LessThan, Repository } from 'typeorm'

import { PageResponse } from '@pengode/common/dtos'
import {
  FindAllRequest,
  LogResponse,
} from '@pengode/product-log/product-log.dto'
import { ProductLogResponse } from '@pengode/product/product.dto'

@Injectable()
export class ProductLogService {
  constructor(
    private readonly productLogRepository: Repository<ProductLogResponse>,
  ) {}

  async findAll(req: FindAllRequest): Promise<PageResponse<LogResponse>> {
    const logs = await this.productLogRepository.find({
      where: {
        id: LessThan(req.cursor),
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
    })

    return {
      items: logs.map(LogResponse.create),
      nextCursor: logs[logs.length - 1]?.id || 0,
    }
  }
}
