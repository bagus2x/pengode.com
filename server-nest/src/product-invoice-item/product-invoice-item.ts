import { DecimalTransformer } from '@pengode/common/transformers'
import { ProductInvoice } from '@pengode/product-invoice/product-invoice'
import { Product } from '@pengode/product/product'
import Decimal from 'decimal.js'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class ProductInvoiceItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  price: Decimal

  @Column({ type: 'float', nullable: true })
  discount?: number | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product

  @ManyToOne(() => ProductInvoice, (invoice) => invoice.items)
  @JoinColumn({ name: 'invoice_id', referencedColumnName: 'id' })
  invoice: ProductInvoice
}
