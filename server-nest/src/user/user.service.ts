import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '@pengode/user/user'
import { UserResponse } from '@pengode/user/user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({ relations: { roles: true } })
    return users.map(UserResponse.build)
  }

  async findById(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    return UserResponse.build(user)
  }
}
