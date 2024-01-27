import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'

@Entity()
@Unique(['user.id', 'product.id'])
export class ProductLike {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  readonly user: User

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  readonly product: Product

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date
}
