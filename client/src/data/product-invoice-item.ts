interface ProductInvoiceItem {
  id: number
  price: string
  discount?: number | null
  product: {
    id: number
    title: string
    previewUrl: string
    price: string
    discount?: number | null
  }
  createdAt: string
}
