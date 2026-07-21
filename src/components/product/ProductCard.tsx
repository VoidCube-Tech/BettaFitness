import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import type { Product } from '../../types/product'
import { formatCurrency } from '../../utils/currency'
import { createWhatsAppUrl } from '../../utils/whatsapp'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [selectedSize, setSelectedSize] = useState('')
  const sizes = product.sizes ?? []
  const message = `Olá! Tenho interesse no produto ${product.name}${selectedSize ? `, tamanho ${selectedSize}` : ''}, no valor de ${formatCurrency(product.price)}. Gostaria de mais informações.`
  return <article className={`catalog-card catalog-card--${index % 4}`}>
    <div className="catalog-photo"><img src={product.image} alt={product.name} loading="lazy" decoding="async" /></div>
    <div className="catalog-meta"><span>{product.type}</span><span>BF—{String(index + 1).padStart(3, '0')}</span></div>
    <h3>{product.name}</h3>
    {!!sizes.length && <div className="product-sizes"><span>Escolha o tamanho</span><div>{sizes.map((size) => <button type="button" key={size} aria-pressed={selectedSize === size} onClick={() => setSelectedSize((current) => current === size ? '' : size)}>{size}</button>)}</div></div>}
    <div className="catalog-price"><strong>{formatCurrency(product.price)}</strong><a href={sizes.length && !selectedSize ? undefined : createWhatsAppUrl(siteConfig.whatsappNumber, message)} aria-disabled={sizes.length > 0 && !selectedSize} onClick={(event) => { if (sizes.length && !selectedSize) event.preventDefault() }} target="_blank" rel="noopener noreferrer">{sizes.length && !selectedSize ? 'Selecione o tamanho' : 'Tenho interesse'} <ArrowUpRight aria-hidden="true" /></a></div>
  </article>
}



