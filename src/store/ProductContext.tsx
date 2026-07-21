import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'
import { productService } from '../services/productService'
import type { Product, ProductInput } from '../types/product'

type ProductContextValue = {
  products: Product[]
  addProduct: (product: ProductInput) => void
  updateProduct: (id: string, product: ProductInput) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  filterProductsByType: (type: string) => Product[]
}

const ProductContext = createContext<ProductContextValue | null>(null)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => productService.getProducts())
  const value = useMemo<ProductContextValue>(() => ({
    products,
    addProduct: (product) => setProducts(productService.createProduct(product)),
    updateProduct: (id, product) => setProducts(productService.updateProduct(id, product)),
    deleteProduct: (id) => setProducts(productService.deleteProduct(id)),
    getProductById: (id) => products.find((product) => product.id === id),
    filterProductsByType: (type) => type === 'Todos' ? products : products.filter((product) => product.type === type),
  }), [products])
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts deve ser usado dentro de ProductProvider')
  return context
}
