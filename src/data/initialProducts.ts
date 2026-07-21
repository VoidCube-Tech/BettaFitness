import aromaResina from '../assets/images/products/aroma-resina.png'
import luminariaArgila from '../assets/images/products/luminaria-argila.png'
import mantaBosque from '../assets/images/products/manta-bosque.png'
import tigelaSerena from '../assets/images/products/tigela-serena.png'
import type { Product } from '../types/product'

export const initialProducts: Product[] = [
  { id: 'luminaria-argila', name: 'Luminária Argila', image: luminariaArgila, price: 389, type: 'Iluminação' },
  { id: 'tigela-serena', name: 'Tigela Serena', image: tigelaSerena, price: 148, type: 'Cerâmica' },
  { id: 'manta-bosque', name: 'Manta Bosque', image: mantaBosque, price: 279, type: 'Têxteis' },
  { id: 'aroma-resina', name: 'Aroma Resina', image: aromaResina, price: 129, type: 'Aromas' },
]
