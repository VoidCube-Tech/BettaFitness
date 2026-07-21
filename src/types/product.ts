export interface Product {
  id: string
  name: string
  image: string
  price: number
  type: string
  sizes?: string[]
}

export type ProductInput = Omit<Product, 'id'>
