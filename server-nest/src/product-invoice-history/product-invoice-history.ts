import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import {
  ProductInvoice,
  Status,
} from '@pengode/product-invoice/product-invoice'

@Entity()
export class ProductInvoiceHistory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: Status })
  status: Status

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => ProductInvoice, (invoice) => invoice.histories)
  invoice: ProductInvoice
}
