import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, MoreThan, Raw, Repository } from 'typeorm'

import { User } from '@pengode/user/user'
import { UserResponse } from '@pengode/user/user.dto'
import { FindAllRequest } from '@pengode/article-category/article-category.dto'
import { PageResponse } from '@pengode/common/dtos'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(req: FindAllRequest): Promise<PageResponse<UserResponse>> {
    const users = await this.userRepository.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),

        name: req.search
          ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
          : undefined,
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
    })

    return {
      items: users.map(UserResponse.create),
      previousCursor: users[0]?.id || 0,
      nextCursor: users[users.length - 1]?.id || 0,
    }
  }

  async findById(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    return UserResponse.create(user)
  }
}
