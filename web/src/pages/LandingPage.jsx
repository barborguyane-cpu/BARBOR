import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, MapPin, Phone, Instagram, Star, ArrowRight, ChevronRight, Clock, Send } from 'lucide-react'
import { useReveal } from '../hooks/useInView.js'

// Particules stables (positions pré-calculées, pas de Math.random au rendu)
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  w:       ((i * 7  + 3) % 3)  + 1,
  top:     ((i * 13 + 5) % 55),
  left:    ((i * 17 + 11) % 100),
  delay:   ((i * 3)  % 50) / 10,
  dur:     ((i * 2)  % 30) / 10 + 2,
  opacity: ((i * 11) % 5)  * 0.1 + 0.15,
}))

// Hook compteur animé — se déclenche quand l'élément entre dans le viewport
function useCountUp(target, duration = 1800) {
  const [count,   setCount]   = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const start = Date.now()
    const isFloat = target % 1 !== 0
    const id = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(isFloat ? parseFloat((target * eased).toFixed(1)) : Math.round(target * eased))
      if (p === 1) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [started, target, duration])

  return [count, ref]
}
import { BARBERS, SERVICES, HOURS } from '../data/mockData.js'
import { loadContent } from '../data/siteContent.js'
import { subscribeMedia, subscribeProducts } from '../data/firestoreData.js'
import { loadReviews, addReview } from '../data/reviewsData.js'

// Lit les avis site et reste à jour
function useSiteReviews() {
  const [reviews, setReviews] = useState(() => loadReviews())
  useEffect(() => {
    const h = () => setReviews(loadReviews())
    window.addEventListener('barbor_reviews_update', h)
    return () => window.removeEventListener('barbor_reviews_update', h)
  }, [])
  return reviews
}

// Lit le contenu CMS + media Firestore (photos barbers/produits en temps réel)
function useSiteContent() {
  const [c, setC] = useState(() => loadContent())
  useEffect(() => {
    const h = () => setC(loadContent())
    window.addEventListener('barbor_cms_update', h)
    const unsub = subscribeMedia(media => setC(prev => ({ ...prev, media: { ...prev.media, ...media } })))
    return () => { window.removeEventListener('barbor_cms_update', h); unsub() }
  }, [])
  return c
}

/* ────────────────────────────────────────────────────────
   NAVIGATION
──────────────────────────────────────────────────────── */
function Nav({ onBook }) {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Accueil',        href: '#hero',     anchor: true },
    { label: 'La marque',      href: '#concept',  anchor: true },
    { label: 'Services',       href: '#services', anchor: true },
    { label: 'Nos Barbers',    href: '#barbers',  anchor: true },
    { label: 'Boutique',       href: '#shop',     anchor: true },
    { label: 'Contact',        href: '#footer',   anchor: true },
    { label: "BARB'DRIVER",           href: '/driver',   anchor: false },
    { label: 'Planning en temps réel', href: '/planning', anchor: false },
  ]

  const handleLink = (l) => {
    setOpen(false)
    if (l.anchor) {
      document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      nav(l.href)
    }
  }

  const scrollTo = (href) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}>
        <div className="flex items-center justify-between px-5 py-4">
          {/* Logo nav */}
          <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2">
            <img src="/logo-rond.png" alt="BARB'OR" className="h-9 w-9 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="flex flex-col items-start leading-none">
              <span className="text-white font-black text-xs tracking-widest uppercase">Barb'or</span>
              <span className="text-gold font-black text-xs tracking-widest uppercase">Guyane</span>
            </div>
          </button>

          {/* Hamburger */}
          <button onClick={() => setOpen(true)}
            className="flex flex-col gap-1.5 p-2 group">
            <span className="w-6 h-0.5 bg-white group-hover:bg-gold transition-colors" />
            <span className="w-4 h-0.5 bg-white group-hover:bg-gold transition-colors" />
            <span className="w-6 h-0.5 bg-white group-hover:bg-gold transition-colors" />
          </button>
        </div>
      </header>

      {/* Fullscreen menu overlay — style Blackbox */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div className={`relative h-full flex flex-col px-8 pt-6 pb-12 transition-all duration-500 ${
          open ? 'translate-y-0' : '-translate-y-4'
        }`}>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <img src="/logo-rond.png" alt="" className="h-10 w-10 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }} />
              <div>
                <p className="font-display text-gold text-xl tracking-widest">BARB'OR</p>
                <p className="text-gray-500 text-[10px] tracking-[4px] uppercase">Guyane</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 text-white/60 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 space-y-2">
            {links.map((l, i) => (
              <button key={l.href} onClick={() => handleLink(l)}
                className={`block w-full text-left py-4 border-b border-white/5
                  font-bold text-2xl tracking-wide transition-colors duration-200
                  ${l.anchor === false
                    ? 'text-gold hover:text-gold/80'
                    : i === 0 ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}>
                {l.label}
                {!l.anchor && <span className="ml-2 text-base align-middle">→</span>}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10">
            <p className="text-gray-700 text-xs tracking-widest">BARB'OR GUYANE © 2025</p>
          </div>
        </div>
      </div>
    </>
  )
}

/* ────────────────────────────────────────────────────────
   TICKER — bandeau défilant premium
──────────────────────────────────────────────────────── */
const TICKER_TEXT = [
  "BARB'OR GUYANE", "✦", "PREMIUM GROOMING", "✦",
  "CAYENNE", "✦", "BARBERSHOP D'EXCELLENCE", "✦",
  "LA QUALITÉ EN PLUS", "✦", "DEPUIS 2024", "✦",
]

function Ticker() {
  const items = [...TICKER_TEXT, ...TICKER_TEXT]
  return (
    <div className="overflow-hidden py-2.5 bg-gold">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className={`inline-block px-4 text-[9px] font-black tracking-[4px] uppercase
            ${item === '✦' ? 'text-black/40' : 'text-black'}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   LOGO HERO — affiché uniquement si une image est disponible
──────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────
   HERO — style Blackbox Paris
──────────────────────────────────────────────────────── */
function Hero({ onBook, onDriver, cms }) {
  const h = cms?.hero || {}
  const bgImg = cms?.media?.heroImageUrl

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-between pt-24 pb-10 overflow-hidden bg-black">

      {/* Hero background image */}
      {bgImg && (
        <div className="absolute inset-0 pointer-events-none">
          <img src={bgImg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>
      )}

      {/* V-beam background effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left beam */}
        <div className="absolute top-0 left-1/2 origin-top animate-beam"
          style={{
            width: '1px',
            height: '65vh',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)',
            transform: 'rotate(-22deg)',
            transformOrigin: 'top center',
            marginLeft: '-0.5px',
          }}
        />
        {/* Right beam */}
        <div className="absolute top-0 left-1/2 origin-top animate-beam"
          style={{
            width: '1px',
            height: '65vh',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)',
            transform: 'rotate(22deg)',
            transformOrigin: 'top center',
            marginLeft: '-0.5px',
            animationDelay: '0.5s',
          }}
        />
        {/* Gold center beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: '1px',
            height: '30vh',
            background: 'linear-gradient(to bottom, rgba(212,175,55,0.4) 0%, transparent 100%)',
          }}
        />

        {/* Particules stables */}
        {PARTICLES.map((p, i) => (
          <div key={i} className="absolute rounded-full bg-white animate-pulse"
            style={{
              width:  p.w + 'px',
              height: p.w + 'px',
              top:    p.top  + '%',
              left:   p.left + '%',
              animationDelay:    p.delay + 's',
              animationDuration: p.dur   + 's',
              opacity: p.opacity,
            }}
          />
        ))}


      </div>

      {/* Logo rond — centré dans le hero avec animation d'entrée */}
      <div className="flex justify-center">
        <img
          src={cms?.media?.logoUrl || '/logo-rond.png'}
          alt="BARB'OR"
          className="w-56 h-56 object-contain animate-logo-enter"
          style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 32px rgba(255,215,0,0.8))' }}
          onError={e => e.target.style.display = 'none'}
        />
      </div>

      {/* Bas du hero — BARB'OR + slogan + CTAs */}
      <div className="relative text-center px-5 space-y-4 w-full">

        {/* Logo texte officiel */}
        <div className="flex justify-center px-2">
          <img
            src="/logo-texte.png"
            alt="BARB'OR Guyane"
            className="w-full object-contain"
            style={{ filter: 'drop-shadow(0 0 14px rgba(255,215,0,0.3))' }}
          />
        </div>

        {/* Slogan séparé par une ligne gold */}
        <div className="flex items-center gap-4 justify-center">
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-gold/50" />
          <p className="text-gray-300 text-base sm:text-lg font-light tracking-[3px] uppercase italic">
            {h.slogan || 'La qualité en plus.'}
          </p>
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button onClick={onBook} className="btn-pill text-base px-10 py-4 font-semibold tracking-wider w-full max-w-xs animate-glow-cta">
            {h.cta || 'Prendre rendez-vous'}
          </button>
          <button onClick={onDriver}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5
              text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all duration-300 tracking-wide w-full max-w-xs justify-center">
            BARB'DRIVER — Service à domicile
          </button>
        </div>

        {/* Horaires rapides */}
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          {h.hours || 'Mar – Sam · 10h–15h • 16h–20h'}
        </p>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   STAT COUNTER — compteur animé à l'entrée dans le viewport
──────────────────────────────────────────────────────── */
function StatCounter({ value, label, suffix }) {
  const num = parseFloat(value) || 0
  const [count, ref] = useCountUp(num)
  const isFloat = num % 1 !== 0
  return (
    <div ref={ref} className="text-center border-l border-gold/20 pl-4">
      <p className="font-display text-4xl text-gold leading-none">
        {isFloat ? count.toFixed(1) : count}
        <span className="text-2xl">{suffix}</span>
      </p>
      <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">{label}</p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   CONCEPT SECTION
──────────────────────────────────────────────────────── */
function ConceptSection({ cms }) {
  const ref = useReveal()
  const co = cms?.concept || {}

  const stats = [
    { value: co.stat1v || '4.9', label: co.stat1l || 'Note client', suffix: '★' },
    { value: co.stat2v || '500', label: co.stat2l || 'Clients',     suffix: '+' },
    { value: co.stat3v || '100', label: co.stat3l || 'Satisfaction', suffix: '%' },
  ]

  return (
    <section id="concept" ref={ref} className="relative py-24 px-6 bg-black overflow-hidden">
      <div className="gold-line mb-16" />

      {/* Section number */}
      <p className="section-number absolute top-16 right-4 select-none">01</p>

      <div className="max-w-lg mx-auto space-y-10">
        <div className="reveal">
          <p className="text-gold text-xs tracking-[5px] uppercase mb-4 font-bold">La Marque</p>
          <h2 className="display-section text-white leading-tight">
            BARB'OR<br/>
            <span className="shimmer-text">GUYANE</span>
          </h2>
        </div>

        <div className="reveal delay-2 space-y-5">
          <p className="text-gray-300 text-lg leading-relaxed font-light">
            {co.text1 || "Plus qu'une coupe, une expérience premium. BARB'OR est né d'une vision : apporter l'excellence du grooming international au cœur de la Guyane."}
          </p>
          <p className="text-gray-500 leading-relaxed">
            {co.text2 || "Chaque détail est pensé pour sublimer votre style — de l'accueil premium à la finition parfaite. Nos barbers sont des artistes, votre style est leur toile."}
          </p>
        </div>

        {/* Stats animées */}
        <div className="reveal delay-3 grid grid-cols-3 gap-4 pt-4">
          {stats.map(s => (
            <StatCounter key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
          ))}
        </div>

        {/* Quote */}
        <div className="reveal delay-4 glass-gold rounded-2xl p-6">
          <p className="text-gold font-display text-2xl tracking-wide">"{co.quote1 || "BARB'OR Guyane —"}</p>
          <p className="text-white font-display text-2xl tracking-wide">{co.quote2 || 'La qualité en plus."'}</p>
        </div>
      </div>

      <div className="gold-line mt-16" />
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   SERVICES SECTION
──────────────────────────────────────────────────────── */
const SVC_TABS = [
  { key: 'coupe',   label: 'Coupes'   },
  { key: 'contour', label: 'Contours' },
  { key: 'barbe',   label: 'Barbes'   },
  { key: 'pack',    label: 'Packs'    },
  { key: 'couleur', label: 'Couleur'  },
  { key: 'soin',    label: 'Soins'    },
  { key: 'extra',   label: 'Extras'   },
]

function ServicesSection({ onBook }) {
  const ref = useReveal()
  const [tab, setTab] = useState('coupe')
  const shown = SERVICES.filter(s => s.category === tab)

  return (
    <section id="services" ref={ref} className="relative py-24 px-5 bg-[#030303] overflow-hidden">
      <p className="section-number absolute top-12 right-4 select-none">02</p>

      <div className="max-w-lg mx-auto">
        <div className="reveal mb-10">
          <p className="text-gold text-xs tracking-[5px] uppercase mb-3 font-bold">Prestations</p>
          <h2 className="display-section text-white">NOS<br/><span className="shimmer-text">TARIFS</span></h2>
          <p className="text-gray-500 text-sm mt-3">Carte Bleue ou Espèces</p>
        </div>

        {/* Category tabs */}
        <div className="reveal flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {SVC_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap shrink-0 transition-all ${
                tab === t.key ? 'bg-gold text-black' : 'bg-[#0D0D0D] border border-white/10 text-gray-400 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Service list */}
        <div className="space-y-2">
          {shown.map((s) => (
            <button key={s.id} onClick={onBook}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                border border-white/5 bg-[#0D0D0D]
                hover:border-gold/30 hover:bg-[#141414] hover:-translate-y-0.5
                transition-all duration-300 text-left group">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm group-hover:text-gold transition-colors truncate">{s.name}</p>
                <p className="text-gray-600 text-xs mt-0.5">{s.duration} min</p>
              </div>
              <div className="text-right shrink-0 flex items-center gap-3">
                {s.devis ? (
                  <span className="text-gray-400 text-sm font-bold italic">Sur devis</span>
                ) : (
                  <p className="font-display text-2xl text-gold leading-none">{s.price}€</p>
                )}
                <ChevronRight size={14} className="text-gray-600 group-hover:text-gold transition-colors" />
              </div>
            </button>
          ))}
        </div>

        <div className="reveal mt-8 text-center">
          <button onClick={onBook} className="btn-outline">
            Réserver maintenant <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   BARBERS SECTION
──────────────────────────────────────────────────────── */
function BarbersSection({ onBook, cms }) {
  const ref = useReveal()
  const photos = cms?.media?.photos || {}

  return (
    <section id="barbers" ref={ref} className="relative py-24 px-5 bg-black overflow-hidden">
      <p className="section-number absolute top-12 right-4 select-none">03</p>

      <div className="max-w-lg mx-auto">
        <div className="reveal mb-12">
          <p className="text-gold text-xs tracking-[5px] uppercase mb-3 font-bold">L'Équipe</p>
          <h2 className="display-section text-white">NOS<br/><span className="shimmer-text">BARBERS</span></h2>
          <p className="text-gray-500 mt-4 leading-relaxed">
            Des artistes passionnés, formés aux dernières techniques. Chaque barber est sélectionné pour son savoir-faire et son sens du style.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {BARBERS.map((b, i) => {
            const photoUrl = photos[b.id]
            return (
              <button key={b.id} onClick={onBook}
                className={`reveal-scale delay-${i+1} group relative rounded-2xl overflow-hidden border border-white/5
                  hover:border-gold/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)]`}
                style={{ aspectRatio: '3/4' }}>
                {/* Photo or placeholder */}
                {photoUrl ? (
                  <img src={photoUrl} alt={b.firstName} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
                )}
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                {/* Avatar fallback (shown only when no photo) */}
                {!photoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                      <span className="font-display text-2xl text-gold">{b.avatar}</span>
                    </div>
                  </div>
                )}
                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-bold text-white text-sm leading-tight">{b.firstName} {b.lastName}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-tight">{b.specialty}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={10} className="text-gold fill-gold" />
                    <span className="text-gold text-xs font-bold">{b.rating}</span>
                    <span className="text-gray-600 text-xs">({b.reviews})</span>
                  </div>
                </div>
                {/* Available dot */}
                {b.available && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   REVIEWS SECTION — Avis Google + Avis site
──────────────────────────────────────────────────────── */
const GOOGLE_REVIEWS = [
  { name: 'Curtis Causse',    initial: 'C', color: '#E91E63', stars: 5, date: 'il y a un an',    text: 'Meilleur coiffeur de guyane aucun doute la dessus. Prix complètement en accord avec la qualité de coupe. Le best pour moi' },
  { name: 'Dalerick Laurent', initial: 'D', color: '#FF5722', stars: 5, date: 'il y a 9 mois',   text: "Cela fait un an que l'on m'a conseillé ce barber, j'y suis allé, j'ai été satisfait. Je recommande !" },
  { name: 'Lyvann Tribord',   initial: 'L', color: '#2196F3', stars: 5, date: 'il y a 2 ans',    text: 'Coiffeur très pro, et hygiène irréprochable ! Salon très accueillant et très propre 10/10 💪' },
  { name: 'cyril labarbe',    initial: 'C', color: '#00BCD4', stars: 5, date: 'il y a un an',    text: "Très agréablement surpris ! autant que par sa gentillesse que dans son professionnalisme. j'y reviendrais avec grand plaisir !!" },
  { name: 'Tomy CAVIGNY',     initial: 'T', color: '#FF9800', stars: 5, date: 'il y a 2 ans',    text: 'Salon propre et barber de qualité !' },
  { name: 'Victor Demagny',   initial: 'V', color: '#9C27B0', stars: 5, date: 'il y a un an',    text: 'Tres arrangeant, tres pros, niquel' },
  { name: 'Rs6 Black',        initial: 'R', color: '#4CAF50', stars: 5, date: 'il y a 3 mois',   text: 'Meilleure salon de coiffure' },
]

const AVATAR_COLORS = ['#E91E63','#FF5722','#2196F3','#00BCD4','#FF9800','#9C27B0','#4CAF50','#F44336','#3F51B5','#009688']

/* Modal formulaire d'avis */
function ReviewModal({ onClose }) {
  const [name,    setName]    = useState('')
  const [stars,   setStars]   = useState(0)
  const [hover,   setHover]   = useState(0)
  const [text,    setText]    = useState('')
  const [done,    setDone]    = useState(false)
  const [err,     setErr]     = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim())  return setErr('Merci d\'indiquer votre prénom.')
    if (stars === 0)   return setErr('Merci de choisir une note.')
    if (!text.trim())  return setErr('Merci d\'écrire un commentaire.')
    addReview({ name, stars, text })
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-white/10 rounded-3xl p-6 space-y-5"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gold text-xs tracking-[4px] uppercase font-bold mb-1">Votre expérience</p>
            <h3 className="text-white font-bold text-lg">Laisser un avis</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {done ? (
          /* Succès */
          <div className="text-center py-8 space-y-3">
            <div className="text-5xl">🙏</div>
            <p className="text-white font-bold text-lg">Merci pour votre avis !</p>
            <p className="text-gray-400 text-sm">Votre témoignage est maintenant visible sur le site.</p>
            <button onClick={onClose} className="btn-gold mt-4 px-8 py-3">Fermer</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Prénom</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Votre prénom"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                  placeholder:text-gray-700 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            {/* Stars */}
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 block">Note</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button"
                    onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                    onClick={() => setStars(s)}
                    className="transition-transform hover:scale-110">
                    <Star size={28}
                      className={(hover || stars) >= s
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-700 fill-gray-700'} />
                  </button>
                ))}
                {stars > 0 && (
                  <span className="ml-1 self-center text-gray-400 text-sm">
                    {['','Mauvais','Passable','Bien','Très bien','Excellent'][stars]}
                  </span>
                )}
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Commentaire</label>
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder="Décrivez votre expérience chez BARB'OR…"
                rows={3}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                  placeholder:text-gray-700 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
            </div>

            {err && <p className="text-red-400 text-xs">{err}</p>}

            <button type="submit"
              className="w-full btn-gold py-4 flex items-center justify-center gap-2 font-semibold tracking-wide">
              <Send size={16} /> Publier mon avis
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* Carte d'avis générique */
function ReviewCard({ r, isGoogle }) {
  const initial = r.initial || r.name?.[0]?.toUpperCase() || '?'
  const color   = r.color   || AVATAR_COLORS[r.id % AVATAR_COLORS.length] || '#D4AF37'
  const date    = r.date    || (r.date_iso ? new Intl.RelativeTimeFormat('fr').format(
    -Math.round((Date.now() - new Date(r.date_iso)) / 86400000), 'day') : '')

  return (
    <div className="shrink-0 snap-start w-72 rounded-2xl border border-white/8 bg-[#0D0D0D]
      p-5 flex flex-col gap-4 hover:border-gold/30 transition-colors">

      {/* Stars + source badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, s) => (
            <Star key={s} size={12}
              className={s < r.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700 fill-gray-700'} />
          ))}
        </div>
        {isGoogle ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        ) : (
          <span className="text-[9px] font-bold text-gold/60 uppercase tracking-wider border border-gold/20 rounded px-1.5 py-0.5">Site</span>
        )}
      </div>

      {/* Text */}
      <p className="text-gray-300 text-sm leading-relaxed flex-1">"{r.text}"</p>

      {/* Reviewer */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
          style={{ background: color }}>
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{r.name}</p>
          <span className="text-gray-600 text-[10px]">{date}</span>
        </div>
      </div>
    </div>
  )
}

function ReviewsSection() {
  const ref        = useReveal()
  const siteReviews = useSiteReviews()
  const [modal, setModal] = useState(false)

  // Mélange : avis site en premier, puis Google
  const siteCards   = siteReviews.map(r => ({ ...r, _google: false }))
  const googleCards = GOOGLE_REVIEWS.map(r => ({ ...r, _google: true }))
  const all         = [...siteCards, ...googleCards]

  return (
    <>
      <section ref={ref} className="relative py-24 bg-[#030303] overflow-hidden">
        <p className="section-number absolute top-12 right-4 select-none">04</p>

        <div className="max-w-lg mx-auto px-5">
          <div className="reveal mb-10">
            <p className="text-gold text-xs tracking-[5px] uppercase mb-3 font-bold">Avis vérifiés</p>
            <div className="flex items-end justify-between">
              <h2 className="display-section text-white">NOS<br/><span className="shimmer-text">CLIENTS</span></h2>
              {/* Google badge */}
              <div className="flex flex-col items-end gap-1 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-gray-400 tracking-wide">Google</span>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-500 text-[10px]">4.9 · 20+ avis</span>
              </div>
            </div>

            {/* Bouton laisser un avis */}
            <button onClick={() => setModal(true)}
              className="mt-6 flex items-center gap-2 px-5 py-3 rounded-full border border-gold/40 bg-gold/5
                text-gold text-sm font-semibold hover:bg-gold/10 transition-all duration-300">
              <Star size={14} className="fill-gold" />
              Laisser un avis
            </button>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-none snap-x snap-mandatory">
          {all.map((r, i) => (
            <ReviewCard key={r.id ?? i} r={r} isGoogle={r._google} />
          ))}
        </div>
      </section>

      {modal && <ReviewModal onClose={() => setModal(false)} />}
    </>
  )
}

/* ────────────────────────────────────────────────────────
   SHOP SECTION
──────────────────────────────────────────────────────── */
function ShopSection({ onShop }) {
  const ref = useReveal()
  const [products, setProducts] = useState([])
  useEffect(() => subscribeProducts(setProducts), [])
  const featured = products.slice(0, 4)

  return (
    <section id="shop" ref={ref} className="relative py-24 px-5 bg-[#030303] overflow-hidden">
      <p className="section-number absolute top-12 right-4 select-none">05</p>

      <div className="max-w-lg mx-auto">
        <div className="reveal mb-12">
          <p className="text-gold text-xs tracking-[5px] uppercase mb-3 font-bold">E-Commerce</p>
          <h2 className="display-section text-white">LA<br/><span className="shimmer-text">BOUTIQUE</span></h2>
          <p className="text-gray-500 mt-4 leading-relaxed">
            Les meilleurs produits de grooming, sélectionnés par nos barbers. Premium, efficace, BARB'OR.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featured.map((p, i) => (
            <button key={p.id} onClick={onShop}
              className={`reveal delay-${i+1} group text-left rounded-2xl border border-white/5 bg-[#0D0D0D] overflow-hidden
                hover:border-gold/30 hover:-translate-y-1 transition-all duration-300`}>
              <div className="aspect-square bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  : <span className="text-4xl">
                      {p.category === 'styling' ? '💈' :
                       p.category === 'soins'   ? '🧴' : '🛒'}
                    </span>
                }
              </div>
              <div className="p-4">
                <p className="text-white font-bold text-sm leading-tight group-hover:text-gold transition-colors">{p.name}</p>
                <p className="text-gray-500 text-xs mt-1">{p.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-display text-2xl text-gold">{p.price}€</span>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-gold fill-gold" />
                    <span className="text-gray-400 text-xs">{p.rating}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="reveal mt-8 text-center">
          <button onClick={onShop} className="btn-outline">
            Voir tous les produits <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   BOOKING CTA SECTION
──────────────────────────────────────────────────────── */
function BookingCTA({ onBook }) {
  const ref = useReveal()

  return (
    <section ref={ref} className="relative py-24 px-5 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px]" />
      </div>

      <div className="relative max-w-lg mx-auto text-center space-y-8">
        <div className="reveal">
          <div className="gold-line mb-10" />
          <p className="text-gold text-xs tracking-[5px] uppercase font-bold mb-6">Premium Grooming</p>
          <h2 className="display-section text-white">
            PRÊT POUR<br/>
            <span className="shimmer-text">L'EXPÉRIENCE ?</span>
          </h2>
          <p className="text-gray-400 mt-6 text-lg leading-relaxed font-light">
            Réservez votre créneau dès maintenant.<br/>
            <span className="text-gold">L'excellence vous attend.</span>
          </p>
        </div>

        <div className="reveal delay-2 space-y-3">
          <button onClick={onBook} className="btn-gold w-full max-w-xs mx-auto py-5 text-base tracking-wider">
            Prendre rendez-vous
          </button>
          <p className="text-gray-600 text-xs tracking-widest">
            BARB'OR GUYANE · CAYENNE · GUYANE FRANÇAISE
          </p>
        </div>

        {/* Features */}
        <div className="reveal delay-3 grid grid-cols-3 gap-4 pt-6">
          {[
            'Réservation\ninstantanée',
            'Qualité\ngarantie',
            'Rappel\nautomatique',
          ].map(label => (
            <div key={label} className="text-center">
              <p className="text-gray-500 text-xs leading-tight whitespace-pre-line">{label}</p>
            </div>
          ))}
        </div>
        <div className="gold-line mt-10" />
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   FOOTER
──────────────────────────────────────────────────────── */
function Footer({ onBook, cms }) {
  const ct = cms?.contact || {}
  const logoUrl    = cms?.media?.logoUrl || '/logo.png'
  const address    = ct.address    || 'Cayenne, Guyane Française'
  const instagram  = ct.instagram  || '@barb_or_'
  const snapchat   = ct.snapchat   || 'BARBORGUYANE'
  const whatsapp   = ct.whatsapp   || '594694250156'
  const mapsUrl    = ct.maps       || 'https://maps.app.goo.gl/xEmF7E68H6aULXj89'
  const mapsEmbed  = ct.mapsEmbed  || 'https://maps.google.com/maps?q=Barb+Or+Guyane+Cayenne+973&output=embed&z=16'
  const phone      = ct.phone      || '0694 25 01 56'
  const phone2     = ct.phone2     || '0594 21 96 33'

  const contactLinks = [
    { icon: MapPin,    text: address,   href: mapsUrl },
    { icon: Phone,     text: phone,     href: `tel:${phone.replace(/\s/g,'')}` },
    { icon: Phone,     text: phone2,    href: `tel:${phone2.replace(/\s/g,'')}` },
    { icon: Instagram, text: instagram, href: `https://instagram.com/${instagram.replace('@','')}` },
    { icon: Instagram, text: `Snapchat · ${snapchat}`, href: `https://snapchat.com/add/${snapchat}` },
  ]

  return (
    <footer id="footer" className="bg-[#050505] border-t border-white/5 px-6 py-16 space-y-12">
      <div className="max-w-lg mx-auto space-y-10">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logoUrl} alt="BARB'OR" className="h-16 w-16 object-contain"
              onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <p className="font-display text-3xl tracking-[8px] text-white">BARB'OR</p>
            <p className="text-gray-600 text-xs tracking-[6px] uppercase mt-1">GUYANE</p>
          </div>
          <p className="text-gray-500 text-sm font-light">
            Premium grooming experience — Cayenne, Guyane
          </p>
        </div>

        {/* Horaires */}
        <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-gold" />
            <p className="text-gold text-xs font-bold uppercase tracking-[4px]">Horaires</p>
          </div>
          {HOURS.schedule.map(h => (
            <div key={h.days} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-gray-400 text-sm">{h.days}</span>
              <span className={`text-sm font-bold ${h.open ? 'text-gold' : 'text-red-400'}`}>{h.times}</span>
            </div>
          ))}
        </div>

        {/* Carte Google Maps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} className="text-gold" />
            <p className="text-gold text-xs font-bold uppercase tracking-[4px]">Nous trouver</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/8" style={{ height: '200px' }}>
            <iframe
              src={mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation BARB'OR"
            />
          </div>
          <a href={mapsUrl} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full
              border border-blue-400/30 bg-blue-500/5 text-blue-300
              hover:bg-blue-500/10 transition-all duration-300 font-semibold tracking-wide text-sm">
            <MapPin size={16} />
            Obtenir l'itinéraire
          </a>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          {contactLinks.map(({ icon: Icon, text, href }) => (
            <a key={text} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
              className="flex items-center gap-4 py-3 border-b border-white/5
                text-gray-400 hover:text-gold transition-colors group">
              <Icon size={18} className="text-gold/60 group-hover:text-gold transition-colors" />
              <span className="text-sm">{text}</span>
              <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        {/* WhatsApp */}
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-full
            border border-green-500/30 bg-green-500/5 text-green-400
            hover:bg-green-500/10 transition-all duration-300 font-semibold tracking-wide">
          <span className="text-xl">📱</span>
          Nous contacter sur WhatsApp
        </a>

        {/* Book CTA */}
        <button onClick={onBook} className="btn-gold w-full py-5 text-base">
          Réserver maintenant
        </button>

        {/* Bottom */}
        <div className="text-center pt-6 border-t border-white/5 space-y-1">
          <p className="text-gray-600 text-xs tracking-widest uppercase">
            © 2025 BARB'OR GUYANE
          </p>
          <p className="text-gray-700 text-xs">
            Tous droits réservés · Premium Barbershop
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ────────────────────────────────────────────────────────
   MAIN LANDING PAGE
──────────────────────────────────────────────────────── */
export function LandingPage({ onRequireAuth }) {
  const nav = useNavigate()
  const cms = useSiteContent()

  const goBook   = () => nav('/booking')
  const goShop   = () => nav('/shop')
  const goDriver = () => nav('/driver')

  return (
    <div className="bg-black">
      <Nav onBook={goBook} />
      <Hero onBook={goBook} onDriver={goDriver} cms={cms} />
      <Ticker />
      <ConceptSection cms={cms} />
      <ServicesSection onBook={goBook} />
      <Ticker />
      <BarbersSection onBook={goBook} cms={cms} />
      <ReviewsSection />
      <ShopSection onShop={goShop} />
      <BookingCTA onBook={goBook} />
      <Footer onBook={goBook} cms={cms} />
    </div>
  )
}
