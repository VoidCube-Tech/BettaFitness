import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowRight, ChevronDown, Menu, ShieldCheck, X } from 'lucide-react'
import heroPoster from '../assets/images/betafitness-activewear-poster.jpg'
import heroVideo from '../assets/videos/betafitness-activewear-hero.mp4'
import { ProductCard } from '../components/product/ProductCard'
import { WhatsAppButton, WhatsAppWidget } from '../components/whatsapp/WhatsApp'
import { useActiveSection, useLenis, useReducedMotion } from '../hooks/useExperience'
import { useProducts } from '../store/ProductContext'
import logo from '../assets/images/betafitness-logo.png'

gsap.registerPlugin(ScrollTrigger)

const nav = [['inicio', 'Início'], ['produtos', 'Produtos'], ['beneficios', 'Por que escolher'], ['sobre', 'Sobre'], ['contato', 'Contato']]
const navIds = nav.map(([id]) => id)
const story = [
  ['Descubra', 'Peças que acompanham diferentes ritmos de treino.', 'Activewear feminino pensado para musculação, cardio, mobilidade e para a rotina depois da academia.'],
  ['Sinta', 'Tecido, sustentação e caimento à primeira vista.', 'Cada produto apresenta o que importa para você escolher conforto e segurança ao se movimentar.'],
  ['Escolha', 'Encontre o look que combina com seu movimento.', 'Compare modelos, confira os tamanhos disponíveis e monte seu conjunto do seu jeito.'],
  ['Converse', 'Uma pessoa responde do outro lado.', 'Tire dúvidas sobre tamanho, combinação e disponibilidade diretamente pelo WhatsApp.'],
]
const faq = [
  ['Como solicito um produto?', 'Escolha o tamanho no card e toque em “Tenho interesse”. O WhatsApp abrirá com o produto, o tamanho e o valor.'],
  ['Os preços estão atualizados?', 'Sim. A equipe atualiza esta vitrine pelo painel sempre que um valor muda.'],
  ['Posso falar diretamente pelo WhatsApp?', 'Pode. Não há carrinho ou intermediários: você conversa com nossa equipe antes de decidir.'],
  ['Como escolher o tamanho?', 'Os tamanhos disponíveis aparecem no card. Se quiser ajuda com caimento e medidas, fale com a equipe.'],
  ['A coleção muda?', 'Sim. Novos tops, leggings, shorts e conjuntos entram conforme cada lançamento BetaFitness.'],
]

const storyMotion = {
  enter: (direction: number) => ({ y: `${direction * 100}%`, opacity: .28 }),
  center: { y: '0%', opacity: 1 },
  exit: (direction: number) => ({ y: `${direction * -100}%`, opacity: .28 }),
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(navIds)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 56)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    const closeOnDesktop = () => { if (window.innerWidth > 980) setOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [open])
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }
  return <header className={`public-header ${scrolled ? 'scrolled' : ''}`}><div className="shell public-header__inner">
    <button className="wordmark" onClick={() => go('inicio')} aria-label="BetaFitness — início">
      <span className="wordmark__logo" aria-hidden="true"><img src={logo} alt="" /></span>
      <span className="wordmark__name">Beta <b>Fitness</b></span>
    </button>
    <nav className={open ? 'open' : ''} aria-label="Navegação principal">{nav.map(([id, label]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => go(id)}>{label}</button>)}</nav>
    <WhatsAppButton className="header-whatsapp">Falar no WhatsApp</WhatsAppButton>
    <button className="public-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button>
  </div></header>
}

function Hero() {
  const reduced = useReducedMotion()
  return <section id="inicio" className="material-hero">
    <img className="material-hero__poster" src={heroPoster} alt="Mulher vestindo conjunto fitness preto em estúdio com luzes lilás" />
    {!reduced && <video className="material-hero__video" autoPlay muted loop playsInline preload="metadata" poster={heroPoster} aria-label="Mulher treinando com roupa fitness em estúdio com luzes lilás"><source src={heroVideo} type="video/mp4" /></video>}
    <div className="material-hero__shade" />
    <div className="material-hero__ghost" aria-hidden="true"><span>FORÇA</span><span>RITMO</span><span>ESTILO</span></div>
    <div className="shell material-hero__content">
      <motion.div className="material-hero__copy" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
        <span className="catalog-label">Moda fitness feminina · Coleção 2026</span>
        <h1>Vista sua força.<br /><em>Mova-se com confiança.</em></h1>
        <p>Leggings, tops, shorts e conjuntos pensados para unir conforto, sustentação e estilo em cada movimento.</p>
        <div><button className="primary-link" onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}>Ver os looks <ArrowRight /></button><WhatsAppButton>Escolher pelo WhatsApp</WhatsAppButton></div>
      </motion.div>
      <aside className="hero-spec" aria-label="Informações da coleção"><span>BF—FIT—001</span><dl><div><dt>Estilo</dt><dd>Moda fitness feminina</dd></div><div><dt>Escolha</dt><dd>Conforto e caimento</dd></div><div><dt>Atendimento</dt><dd>Direto, sem robôs</dd></div></dl></aside>
      <button className="material-scroll" onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}><ArrowDown /><span>Continue</span></button>
    </div>
  </section>
}

function About() {
  return <section id="sobre" className="material-about" data-page-reveal><div className="shell material-about__grid">
    <div className="material-about__lead"><span className="catalog-label catalog-label--dark">Feita para o seu ritmo</span><h2>Conforto que acompanha cada movimento.</h2></div>
    <div className="material-about__text"><p>Começamos pela pergunta que importa no provador e no treino: <strong>essa peça se move comigo?</strong></p><p>Selecionamos modelagens confortáveis, boa sustentação e liberdade para você treinar, caminhar e viver sua rotina com confiança.</p></div>
  </div></section>
}

function Products() {
  const { products } = useProducts()
  const [type, setType] = useState('Todos')
  const types = ['Todos', ...new Set(products.map((product) => product.type))]
  const visible = type === 'Todos' ? products : products.filter((product) => product.type === type)
  return <section id="produtos" className="material-products" data-page-reveal><div className="shell">
    <div className="material-section-head"><div><span className="catalog-label catalog-label--dark">Coleção atual</span><h2>Seu treino.<br />Seu estilo.</h2></div><p>Escolha o modelo, confira os tamanhos disponíveis e fale diretamente com a equipe.</p></div>
    <div className="type-filter" role="group" aria-label="Filtrar produtos por tipo">{types.map((item) => <button key={item} onClick={() => setType(item)} aria-pressed={type === item}>{item}</button>)}</div>
    <motion.div layout className="catalog-grid"><AnimatePresence mode="popLayout">{visible.map((product, index) => <motion.div layout key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}><ProductCard product={product} index={index} /></motion.div>)}</AnimatePresence></motion.div>
    {!visible.length && <div className="catalog-empty"><p>Nenhum produto desse tipo está publicado agora.</p><button onClick={() => setType('Todos')}>Ver o catálogo completo</button></div>}
  </div></section>
}

function ProductStory() {
  const scope = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const previousActive = useRef(active)
  const reduced = useReducedMotion()
  const direction = active >= previousActive.current ? 1 : -1
  useEffect(() => { previousActive.current = active }, [active])
  useEffect(() => {
    if (!scope.current || reduced) return
    const responsiveStory = gsap.matchMedia()
    responsiveStory.add('(min-width: 900px)', () => {
      if (!scope.current) return
      const trigger = ScrollTrigger.create({
        trigger: scope.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: .7,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4))),
      })
      return () => trigger.kill()
    })
    responsiveStory.add('(max-width: 899px)', () => {
      let animationFrame = 0
      const updateMobileStory = () => {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = window.requestAnimationFrame(() => {
          const section = scope.current
          if (!section) return
          const sectionTop = section.getBoundingClientRect().top
          const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
          const progress = Math.min(1, Math.max(0, -sectionTop / scrollDistance))
          const nextStep = Math.min(3, Math.floor(progress * 4))
          setActive((current) => current === nextStep ? current : nextStep)
        })
      }
      updateMobileStory()
      window.addEventListener('scroll', updateMobileStory, { passive: true })
      window.addEventListener('resize', updateMobileStory)
      window.addEventListener('orientationchange', updateMobileStory)
      return () => {
        window.cancelAnimationFrame(animationFrame)
        window.removeEventListener('scroll', updateMobileStory)
        window.removeEventListener('resize', updateMobileStory)
        window.removeEventListener('orientationchange', updateMobileStory)
      }
    })
    return () => responsiveStory.revert()
  }, [reduced])
  return <section ref={scope} className="material-story">
    <div className="material-story__sticky"><div className="shell material-story__layout"><span className="story-side-label">Como escolher</span><div className="material-story__stage"><AnimatePresence initial={false} custom={direction} mode="sync"><motion.article className="material-story__panel" key={active} custom={direction} variants={storyMotion} initial="enter" animate="center" exit="exit" transition={{ duration: .68, ease: [.76, 0, .24, 1] }}><span>{story[active][0]}</span><h2>{story[active][1]}</h2><p>{story[active][2]}</p></motion.article></AnimatePresence></div><div className="material-story__progress"><b>{String(active + 1).padStart(2, '0')} / 04</b><div><i style={{ '--story-progress': `${(active + 1) * 25}%`, height: 'var(--story-progress)' } as CSSProperties} />{story.map(([name], index) => <span className={index === active ? 'active' : ''} key={name}>{name}</span>)}</div></div></div></div>
    <div className="shell story-mobile-sequence"><div className="story-mobile-progress" aria-label="Quatro etapas">{story.map(([name], index) => <span key={name}>{String(index + 1).padStart(2, '0')}</span>)}</div>{story.map(([name, title, text], index) => <article key={name}><span>{String(index + 1).padStart(2, '0')} / 04 · {name}</span><h2>{title}</h2><p>{text}</p></article>)}</div>
  </section>
}

function Benefits() {
  return <section id="beneficios" className="material-benefits" data-page-reveal><div className="shell material-benefits__grid"><div><span className="catalog-label">Feita para se mover</span><h2>Confiança no look. Liberdade no movimento.</h2></div><div className="benefit-notes"><article><span>Caimento</span><h3>Conforto que acompanha o corpo.</h3><p>Modelagens pensadas para você se movimentar com segurança do aquecimento à última série.</p></article><article><span>Tamanho</span><h3>Escolha visível no próprio produto.</h3><p>Confira as opções disponíveis e envie o tamanho certo junto com sua mensagem.</p></article><article><span>Conversa</span><h3>Atendimento próximo e direto.</h3><p>O WhatsApp abre com produto, tamanho e valor para a equipe continuar dali.</p></article></div></div></section>
}

function WhatsAppCTA() {
  return <section id="contato" className="material-contact" data-page-reveal><div className="shell"><span className="catalog-label catalog-label--dark">Atendimento humano</span><h2>Já imaginou seu próximo look?</h2><p>Conte o modelo e o tamanho. A gente confirma disponibilidade e medidas pelo WhatsApp.</p><WhatsAppButton>Conversar pelo WhatsApp</WhatsAppButton></div></section>
}

function FAQ() {
  const [open, setOpen] = useState(0)
  return <section className="material-faq" data-page-reveal><div className="shell material-faq__grid"><div><span className="catalog-label catalog-label--dark">Antes de perguntar</span><h2>Dúvidas comuns, respostas diretas.</h2></div><div>{faq.map(([question, answer], index) => <article key={question}><h3><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} aria-controls={`answer-${index}`}>{question}<ChevronDown /></button></h3><div id={`answer-${index}`} className={open === index ? 'open' : ''}><p>{answer}</p></div></article>)}</div></div></section>
}

function Footer() {
  return <footer className="material-footer" data-page-reveal><div className="shell"><div className="footer-wordmark"><img src={logo} alt="" /><span>Beta</span><b>Fitness</b></div><p>Moda fitness feminina para acompanhar seu treino, sua rotina e sua confiança.</p><div className="footer-links"><div><b>Atendimento</b><span>Direto pelo WhatsApp</span><span>Escolha seu produto e tamanho</span></div><div><b>Catálogo</b><a href="#produtos">Leggings e shorts</a><a href="#produtos">Tops e conjuntos</a></div><div><b>Institucional</b><a href="/admin/produtos">Acesso administrativo</a><a href="#">Privacidade</a></div></div><div className="footer-legal"><span>© 2026 BetaFitness</span><span>Moda feminina em movimento.</span></div></div></footer>
}

export default function HomePage() {
  useLenis()
  const page = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!page.current || reduced) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-page-reveal]').forEach((section) => {
        const content = section.querySelector<HTMLElement>(':scope > .shell')
        if (!content) return
        gsap.fromTo(content,
          { y: 84, opacity: .18, scale: .985 },
          { y: 0, opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 92%', end: 'top 54%', scrub: .75, invalidateOnRefresh: true } },
        )
      })
    }, page)
    return () => context.revert()
  }, [reduced])
  return <div ref={page} className="site-page"><a className="skip-link" href="#public-main">Pular para o conteúdo</a><Header /><main id="public-main"><Hero /><About /><Products /><ProductStory /><Benefits /><WhatsAppCTA /><FAQ /></main><Footer /><WhatsAppWidget /></div>
}




