import { Injectable, NotFoundException } from '@nestjs/common'
import { LessThan, MoreThan, Repository } from 'typeorm'

import { InjectRepository } from '@nestjs/typeorm'
import { PageResponse } from '@pengode/common/dtos'
import { ProductLog } from '@pengode/product-log/product-log'
import {
  CreateLogRequest,
  FindAllRequest,
  LogResponse,
} from '@pengode/product-log/product-log.dto'
import { Product } from '@pengode/product/product'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class ProductLogService {
  constructor(
    @InjectRepository(ProductLog)
    private readonly productLogRepository: Repository<ProductLog>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly clsService: ClsService,
  ) {}

  async create(req: CreateLogRequest): Promise<LogResponse> {
    const product = await this.productRepository.findOne({
      where: {
        id: req.productId,
        owner: { id: this.clsService.get<number>('userId') },
      },
    })
    if (!product) {
      throw new NotFoundException('product is not found')
    }

    const log = await this.productLogRepository.save({
      name: req.name,
      description: req.description,
      productUrl: req.productUrl,
      product,
    })

    return LogResponse.create(log)
  }

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

  async update(logId: number, req: CreateLogRequest): Promise<LogResponse> {
    const log = await this.productLogRepository.findOne({
      where: {
        id: logId,
        product: {
          id: req.productId,
          owner: { id: this.clsService.get<number>('userId') },
        },
      },
    })
    if (!log) {
      throw new NotFoundException('log is not found')
    }

    log.name = req.name
    log.description = req.description
    log.productUrl = req.productUrl

    const updatedLog = await this.productLogRepository.save(log)

    return LogResponse.create(updatedLog)
  }
}
