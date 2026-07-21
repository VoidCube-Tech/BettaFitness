import { initialProducts } from '../data/initialProducts'
import type { Product, ProductInput } from '../types/product'

const STORAGE_KEY = 'casa-materia:products:v1'

function read(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const products = saved ? JSON.parse(saved) as Product[] : initialProducts
    return products.map((product) => ({ ...product, sizes: product.sizes ?? [] }))
  } catch {
    return initialProducts
  }
}

function write(products: Product[]): Product[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  return products
}

export const productService = {
  getProducts: (): Product[] => read(),
  createProduct: (input: ProductInput): Product[] => write([...read(), { ...input, id: crypto.randomUUID() }]),
  updateProduct: (id: string, input: ProductInput): Product[] => write(read().map((product) => product.id === id ? { ...input, id } : product)),
  deleteProduct: (id: string): Product[] => write(read().filter((product) => product.id !== id)),
}
