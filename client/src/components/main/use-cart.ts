import { Product } from '@pengode/data/product'
import { create } from 'zustand'

export interface CartState {
  products: Product[]
  add: (product: Product) => void
  remove: (productId: number) => void
}

export const useCart = create<CartState>((set) => ({
  products: [],
  add: (product) => {
    set((state) => {
      if (state.products.includes(product)) return state

      return { ...state, products: [...state.products, product] }
    })
  },
  remove: (productId) => {
    set((state) => ({
      ...state,
      products: state.products.filter((product) => product.id !== productId),
    }))
  },
}))
