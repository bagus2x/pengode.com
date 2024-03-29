import { DecimalTransformer } from '@pengode/common/transformers'
import { ProductCategory } from '@pengode/product-category/product-category'
import { ProductLog } from '@pengode/product-log/product-log'
import { User } from '@pengode/user/user'
import Decimal from 'decimal.js'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum Status {
  VISIBLE = 'VISIBLE',
  INVISIBLE = 'INVISIBLE',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ name: 'preview_url' })
  previewUrl: string

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  price: Decimal

  @Column({ type: 'float', nullable: true })
  discount?: number | null

  @Column({ type: 'enum', enum: Status })
  status: Status

  @Column({ name: 'number_of_one_stars' })
  numberOfOneStars: number

  @Column({ name: 'number_of_two_stars' })
  numberOfTwoStars: number

  @Column({ name: 'number_of_three_stars' })
  numberOfThreeStars: number

  @Column({ name: 'number_of_four_stars' })
  numberOfFourStars: number

  @Column({ name: 'number_of_five_stars' })
  numberOfFiveStars: number

  @Column({ name: 'number_of_buyers' })
  numberOfBuyers: number

  @Column({ name: 'number_of_likes' })
  numberOfLikes: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  owner: User

  @ManyToMany(() => ProductCategory)
  @JoinTable({
    name: 'tr_product_category',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: ProductCategory[]

  @OneToMany(() => ProductLog, (log) => log.product)
  logs: ProductLog[]
}
