import { Status } from '@pengode/data/product-invoice'

export interface HistoryResponse {
  id: number
  status: Status
  invoiceId: number
  createdAt: Date
}
