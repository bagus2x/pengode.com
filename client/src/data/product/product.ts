export interface Product {
  id: number
  title: string
  description: string
  previewUrl: string
  price: string
  status: 'VISIBLE' | 'INVISIBLE'
  discount?: number | null
  categories: {
    id: number
    name: string
  }[]
  logs: {
    id: number
    name: string
    productUrl: string
    description: string
    createdAt: Date
  }[]
  owner: {
    id: number
    email: string
    username: string
    name: string
    photo?: string | null
  }
  numberOfOneStars: number
  numberOfTwoStars: number
  numberOfThreeStars: number
  numberOfFourStars: number
  numberOfFiveStars: number
  numberOfBuyers: number
  liked?: boolean
  paid?: boolean
  createdAt: string
}
