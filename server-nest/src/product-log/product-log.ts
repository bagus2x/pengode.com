import { Product } from '@pengode/product/product'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class ProductLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 54 })
  name: string

  @Column({ name: 'product_url' })
  productUrl: string

  @Column({ type: 'text' })
  description: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => Product, (product) => product.logs, { eager: true })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product
}
