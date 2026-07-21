import { type FormEvent, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import loginPoster from '../assets/images/betafitness-activewear-poster.jpg'
import loginVideo from '../assets/videos/betafitness-activewear-hero.mp4'
import { useReducedMotion } from '../hooks/useExperience'
import { useAuth } from '../store/AuthContext'
import logo from '../assets/images/betafitness-logo.png'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin/produtos'

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/produtos', { replace: true })
  }, [isAuthenticated, navigate])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Preencha o e-mail e a senha para continuar.')
      return
    }
    if (!login(email, password)) {
      setError('E-mail ou senha incorretos. Verifique os dados e tente novamente.')
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return <main className="login-page">
    <section className="login-panel" aria-labelledby="login-title">
      <Link className="login-brand" to="/" aria-label="Voltar para a BetaFitness"><span><img src={logo} alt="" /></span><div>Beta<b>Fitness</b></div></Link>
      <div className="login-panel__content">
        <span className="catalog-label catalog-label--dark">Acesso administrativo</span>
        <h1 id="login-title">Cuide da<br />vitrine.</h1>
        <p>Entre para publicar looks, atualizar tamanhos e manter a coleção BetaFitness em movimento.</p>
        <form className="login-form" onSubmit={submit} noValidate>
          <label>
            <span>E-mail</span>
            <div className={error ? 'login-input login-input--error' : 'login-input'}><Mail aria-hidden="true" /><input type="email" autoComplete="username" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" autoFocus /></div>
          </label>
          <label>
            <span>Senha</span>
            <div className={error ? 'login-input login-input--error' : 'login-input'}><LockKeyhole aria-hidden="true" /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff /> : <Eye />}</button></div>
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit">Entrar no painel <ArrowRight aria-hidden="true" /></button>
        </form>
        <Link className="login-back" to="/"><ArrowLeft aria-hidden="true" />Voltar para a vitrine</Link>
      </div>
      <p className="login-panel__legal">BetaFitness · ambiente restrito</p>
    </section>
    <aside className="login-visual" aria-label="Moda fitness feminina BetaFitness">
      <img src={loginPoster} alt="Mulher vestindo conjunto fitness em estúdio com luzes lilás" />
      {!reducedMotion && <video autoPlay muted loop playsInline preload="metadata" poster={loginPoster} aria-hidden="true"><source src={loginVideo} type="video/mp4" /></video>}
      <div className="login-visual__shade" />
      <div className="login-visual__content">
        <span>BF — GESTÃO</span>
        <blockquote>“Movimento também é confiança.”</blockquote>
        <p>Looks, tamanhos, valores e publicações reunidos para manter a coleção sempre pronta para o próximo treino.</p>
      </div>
      <div className="login-visual__index"><span>PAINEL</span><b>01 / 01</b></div>
    </aside>
  </main>
}




