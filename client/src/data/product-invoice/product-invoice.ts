export interface ProductInvoice {
  id: number
  status: 'PENDING' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELED'
  customer: {
    id: number
    email: string
    username: string
    phone: string
    name: string
    photo: string
  }
  items: ProductInvoiceItem[]
  grossAmount: string
  token: string
  redirectUrl: string
  histories: {
    id: number
    status: string
    createdAt: string
  }
  createdAt: string
}
