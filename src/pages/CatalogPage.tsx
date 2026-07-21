import { ShoppingBag } from 'lucide-react'
import { ProductCard } from '../components/product/ProductCard'
import { useProducts } from '../store/ProductContext'
import logo from '../assets/images/betafitness-logo.png'

export default function CatalogPage() {
  const { products } = useProducts()
  return <main className="shared-catalog">
    <header><div className="shared-catalog__mark"><img src={logo} alt="BetaFitness" /></div><div><span>Activewear feminino</span><h1>Seu treino.<br />Seu próximo look.</h1><p>Escolha a peça, selecione o tamanho disponível e peça diretamente pelo WhatsApp.</p></div></header>
    {products.length ? <section className="shared-catalog__grid" aria-label="Produtos disponíveis">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</section> : <section className="shared-catalog__empty"><ShoppingBag /><h2>A vitrine está sendo preparada</h2><p>Novos produtos aparecerão aqui em breve.</p></section>}
  </main>
}



