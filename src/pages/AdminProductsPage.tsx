import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, ChevronDown, Copy, ImagePlus, LayoutGrid, LogOut, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useProducts } from '../store/ProductContext'
import type { Product, ProductInput } from '../types/product'
import { formatCurrency } from '../utils/currency'
import logo from '../assets/images/betafitness-logo.png'

type FormErrors = Partial<Record<'name' | 'image' | 'price' | 'type', string>>

function ProductDialog({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (input: ProductInput) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState(product?.name ?? '')
  const [image, setImage] = useState(product?.image ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [type, setType] = useState(product?.type ?? '')
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? [])
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const node = dialog.current
    node?.showModal()
    const close = () => onClose()
    node?.addEventListener('cancel', close)
    return () => { node?.removeEventListener('cancel', close); node?.close() }
  }, [onClose])

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowed.includes(file.type)) return setErrors((current) => ({ ...current, image: 'Use PNG, JPG, JPEG ou WebP.' }))
    if (file.size > 2 * 1024 * 1024) return setErrors((current) => ({ ...current, image: 'A imagem deve ter até 2 MB.' }))
    const reader = new FileReader()
    reader.onload = () => { setImage(String(reader.result)); setErrors((current) => ({ ...current, image: undefined })) }
    reader.readAsDataURL(file)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Informe o nome do produto.'
    if (!image) next.image = 'Adicione uma foto.'
    if (!price || Number(price.replace(',', '.')) <= 0) next.price = 'Informe um preço maior que zero.'
    if (!type.trim()) next.type = 'Informe o tipo do produto.'
    setErrors(next)
    if (!Object.keys(next).length) onSave({ name: name.trim(), image, price: Number(price.replace(',', '.')), type: type.trim(), sizes })
  }

  return <dialog ref={dialog} className="product-dialog" onClick={(event) => { if (event.target === dialog.current) onClose() }}>
    <form onSubmit={submit} noValidate>
      <header><div><span>{product ? 'Editar cadastro' : 'Novo cadastro'}</span><h2>{product ? product.name : 'Adicionar produto'}</h2></div><button type="button" onClick={onClose} aria-label="Fechar formulário"><X /></button></header>
      <div className="product-form-body">
        <div className="image-field"><span>Foto do produto *</span>{image ? <div className="image-preview"><img src={image} alt="Prévia do produto" /><button type="button" onClick={() => setImage('')}><Trash2 /> Remover foto</button></div> : <label className={errors.image ? 'invalid' : ''}><ImagePlus /><b>Escolher uma foto</b><span>PNG, JPG ou WebP · até 2 MB</span><input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={upload} /></label>}{errors.image && <small role="alert">{errors.image}</small>}</div>
        <div className="admin-fields"><label><span>Nome do produto *</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <small id="name-error">{errors.name}</small>}</label><label><span>Preço *</span><div className="price-input"><b>R$</b><input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0,00" aria-invalid={!!errors.price} /></div>{errors.price && <small>{errors.price}</small>}</label><label><span>Tipo *</span><input value={type} onChange={(event) => setType(event.target.value)} placeholder="Ex.: Legging, Top ou Conjunto" aria-invalid={!!errors.type} />{errors.type && <small>{errors.type}</small>}</label></div>
      </div>
      <footer><button type="button" onClick={onClose}>Cancelar</button><button type="submit">{product ? 'Salvar alterações' : 'Salvar produto'}</button></footer>
      <fieldset className="size-field"><legend>Tamanhos disponíveis</legend><p>Clique para selecionar ou desmarcar.</p><div>{['PP', 'P', 'M', 'G', 'GG', 'XG'].map((size) => <button key={size} type="button" aria-pressed={sizes.includes(size)} onClick={() => setSizes((current) => current.includes(size) ? current.filter((item) => item !== size) : [...current, size])}>{size}</button>)}</div></fieldset>
    </form>
  </dialog>
}

function ConfirmDialog({ product, onCancel, onConfirm }: { product: Product; onCancel: () => void; onConfirm: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const node = dialog.current
    node?.showModal()
    const cancel = () => onCancel()
    node?.addEventListener('cancel', cancel)
    return () => { node?.removeEventListener('cancel', cancel); node?.close() }
  }, [onCancel])
  return <dialog ref={dialog} className="confirm-dialog"><div><span className="confirm-icon"><Trash2 /></span><h2>Excluir {product.name}?</h2><p>O produto sairá da vitrine pública. Essa ação não pode ser desfeita.</p><div><button onClick={onCancel}>Cancelar</button><button onClick={onConfirm}>Excluir produto</button></div></div></dialog>
}

export default function AdminProductsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [editing, setEditing] = useState<Product | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('Todos')
  const [notice, setNotice] = useState('')
  const types = ['Todos', ...new Set(products.map((product) => product.type))]
  const visible = useMemo(() => products.filter((product) => (type === 'Todos' || product.type === type) && product.name.toLowerCase().includes(search.toLowerCase())), [products, search, type])
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 3500) }
  const save = (input: ProductInput) => {
    try {
      if (editing) { updateProduct(editing.id, input); notify('Alterações publicadas na vitrine.') }
      else { addProduct(input); notify('Produto adicionado à vitrine.') }
      setEditing(undefined)
    } catch {
      notify('Não foi possível salvar. Reduza a imagem e tente novamente.')
    }
  }
  const remove = () => {
    if (!deleting) return
    try { deleteProduct(deleting.id); setDeleting(null); notify('Produto excluído da vitrine.') }
    catch { notify('Não foi possível excluir. Tente novamente.') }
  }
  const leavePanel = () => { logout(); navigate('/login', { replace: true }) }
  const copyCatalogLink = async () => {
    const url = `${window.location.origin}/catalogo`
    try { await navigator.clipboard.writeText(url); notify('Link da vitrine copiado.') }
    catch { window.prompt('Copie o link da vitrine:', url) }
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar"><Link className="admin-brand" to="/"><span><img src={logo} alt="" /></span><div>Beta<b>Fitness</b></div></Link><nav><span>Catálogo</span><a className="active" href="#produtos"><LayoutGrid />Produtos</a></nav><button className="admin-exit" type="button" onClick={leavePanel}><LogOut />Sair do painel</button></aside>
    <main className="admin-main" id="produtos"><header className="admin-topbar"><div className="admin-topbar__title"><span>Administração</span><b>Catálogo de produtos</b></div><div className="admin-topbar__actions"><Link to="/">Abrir vitrine <ArrowRightIcon /></Link><button type="button" onClick={leavePanel} aria-label="Sair do painel"><LogOut /><span>Sair</span></button></div></header>
      <div className="admin-content"><div className="catalog-link-panel"><div><b>Link da vitrine</b><span>{window.location.origin}/catalogo</span></div><button type="button" onClick={copyCatalogLink}><Copy />Copiar link</button></div><div className="admin-title"><div><span>Produtos</span><h1>Catálogo publicado</h1><p>{products.length} {products.length === 1 ? 'produto disponível' : 'produtos disponíveis'} na vitrine.</p></div><button onClick={() => setEditing(null)}><Plus />Adicionar produto</button></div>
        <div className="admin-toolbar"><label><span className="sr-only">Buscar produto</span><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar pelo nome" /></label><label><span className="sr-only">Filtrar por tipo</span><select value={type} onChange={(event) => setType(event.target.value)}>{types.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></label></div>
        <div className="admin-table"><div className="admin-table-head"><span>Foto</span><span>Nome</span><span>Tipo</span><span>Preço</span><span>Ações</span></div>{visible.map((product) => <article key={product.id}><div className="admin-product-image"><img src={product.image} alt="" /></div><div className="admin-product-name"><b>{product.name}</b><span>#{product.id.slice(0, 8)}</span></div><span className="admin-type">{product.type}</span><strong>{formatCurrency(product.price)}</strong><div className="admin-actions"><button onClick={() => setEditing(product)}><Pencil />Editar</button><button onClick={() => setDeleting(product)}><Trash2 />Excluir</button></div></article>)}</div>
        {!visible.length && <div className="admin-empty"><Search /><h2>Nenhum produto encontrado</h2><p>Ajuste a busca ou escolha outro tipo.</p><button onClick={() => { setSearch(''); setType('Todos') }}>Limpar filtros</button></div>}
      </div>
    </main>
    {editing !== undefined && <ProductDialog product={editing} onClose={() => setEditing(undefined)} onSave={save} />}
    {deleting && <ConfirmDialog product={deleting} onCancel={() => setDeleting(null)} onConfirm={remove} />}
    {notice && <div className="admin-toast" role="status"><CheckCircle2 />{notice}</div>}
  </div>
}

function ArrowRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
}



