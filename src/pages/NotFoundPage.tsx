import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <main className="not-found"><span>404</span><h1>Essa página não está no catálogo.</h1><p>O endereço pode ter mudado ou não existe.</p><Link to="/">Voltar para a vitrine</Link></main>
}
