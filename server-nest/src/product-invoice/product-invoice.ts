import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { User } from '@pengode/user/user'
import Decimal from 'decimal.js'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum Status {
  PENDING = 'PENDING',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

@Entity()
export class ProductInvoice {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'order_id', unique: true })
  orderId: string

  @Column({ type: 'enum', enum: Status })
  status: Status

  @Column({ nullable: true })
  paymentMethod?: string | null

  @Column({ length: 511 })
  token: string

  @Column({ length: 511 })
  redirectUrl: string

  @Column({ nullable: true })
  paidAt?: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: User

  @OneToMany(() => ProductInvoiceHistory, (history) => history.invoice, {
    eager: true,
  })
  histories: ProductInvoiceHistory[]

  @OneToMany(() => ProductInvoiceItem, (item) => item.invoice, { eager: true })
  items: ProductInvoiceItem[]

  static grossAmount(items: { price: Decimal; discount?: number }[]): Decimal {
    return items.reduce((grossAmount, item) => {
      return grossAmount.add(
        item.price.sub(item.price.times(new Decimal(item.discount || 0))),
      )
    }, new Decimal(0))
  }
}
