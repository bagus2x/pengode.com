import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'

import { Product } from '@pengode/product/product'
import { User } from '@pengode/user/user'

@Entity()
export class ProductLike {
  @PrimaryColumn({ name: 'user_id' })
  readonly userId: number

  @PrimaryColumn({ name: 'product_id' })
  readonly productId: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  readonly user: User

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  readonly product: Product

  @CreateDateColumn({ name: 'created_at' })
  readonly date: Date
}
