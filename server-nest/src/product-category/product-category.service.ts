import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, MoreThan, Repository } from 'typeorm'

import { PageResponse } from '@pengode/common/dtos'
import { ProductCategory } from '@pengode/product-category/product-category'
import {
  CategoryResponse,
  CreateCategoryRequest,
  FindAllRequest,
} from '@pengode/product-category/product-category.dto'

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(req: CreateCategoryRequest): Promise<CategoryResponse> {
    const category = await this.productCategoryRepository.save({
      name: req.name,
    })

    return CategoryResponse.create(category)
  }

  async findAll(req: FindAllRequest): Promise<PageResponse<CategoryResponse>> {
    const categories = await this.productCategoryRepository.find({
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
      items: categories.map(CategoryResponse.create),
      previousCursor: categories[0]?.id,
      nextCursor: categories[categories.length - 1]?.id || 0,
    }
  }

  async findById(categoryId: number): Promise<CategoryResponse> {
    const category = await this.productCategoryRepository.findOne({
      where: { id: categoryId },
    })
    if (!category) {
      throw new NotFoundException('category is not found')
    }

    return CategoryResponse.create(category)
  }
}
