import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, MapPin, Phone, Instagram, Star, ArrowRight, ChevronRight, Clock } from 'lucide-react'
import { useReveal } from '../hooks/useInView.js'
import { BARBERS, SERVICES, PRODUCTS, HOURS } from '../data/mockData.js'

/* ────────────────────────────────────────────────────────
   NAVIGATION
──────────────────────────────────────────────────────── */
function Nav({ onBook }) {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Accueil',    href: '#hero'     },
    { label: 'La marque',  href: '#concept'  },
    { label: 'Services',   href: '#services' },
    { label: 'Nos Barbers',href: '#barbers'  },
    { label: 'Boutique',   href: '#shop'     },
    { label: 'Contact',    href: '#footer'   },
  ]

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
          {/* Logo icon */}
          <button onClick={() => scrollTo('#hero')} className="flex items-center">
            <img src="/logo.png" alt="BARB'OR" className="h-9 w-9 object-contain"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="h-9 w-9 hidden items-center justify-center rounded-lg border border-gold/40 bg-gold/10">
              <span className="text-gold font-display text-lg leading-none">B</span>
            </div>
          </button>

          {/* Center CTA */}
          <button onClick={onBook}
            className="btn-pill text-sm font-bold tracking-widest uppercase px-6 py-3">
            Réserver
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
              <img src="/logo.png" alt="" className="h-9 w-9 object-contain"
                onError={e => e.target.style.display='none'} />
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
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className={`block w-full text-left py-4 border-b border-white/5
                  font-bold text-2xl tracking-wide transition-colors duration-200
                  ${i === 0 ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                {l.label}
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
   LOGO HERO — avec fallback si logo.png absent
──────────────────────────────────────────────────────── */
function LogoHero() {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div className="absolute top-[10vh] left-1/2 -translate-x-1/2 flex items-center justify-center">
      {/* Halos */}
      <div className="absolute w-52 h-52 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute w-40 h-40 rounded-full bg-gold/20 blur-xl" />

      {/* Logo officiel */}
      {imgOk ? (
        <img
          src="/logo.png"
          alt="BARB'OR"
          className="relative w-36 h-36 object-contain drop-shadow-2xl rounded-full"
          onError={() => setImgOk(false)}
        />
      ) : (
        /* Fallback gold si logo.png manquant */
        <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B8960C] to-[#8B6914]
          flex flex-col items-center justify-center shadow-2xl border-2 border-gold/50">
          {/* Poteau de barbier stylisé */}
          <div className="flex gap-1 mb-1">
            {['#fff','#1a1a5e','#fff'].map((c, i) => (
              <div key={i} className="w-1.5 h-8 rounded-full" style={{ background: c, opacity: 0.9 }} />
            ))}
          </div>
          <p className="text-black font-black text-xs tracking-[2px] leading-none mt-1">BARB'OR</p>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   HERO — style Blackbox Paris
──────────────────────────────────────────────────────── */
function Hero({ onBook }) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-end pb-16 overflow-hidden bg-black">

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

        {/* Stars */}
        {[...Array(18)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 55 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}

        {/* Ambient gold glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[300px] h-[300px] rounded-full bg-gold/5 blur-[80px]" />
      </div>

      {/* Logo central — grand, lumineux, en haut */}
      <LogoHero />

      {/* Hero content — bottom aligned like Blackbox */}
      <div className="relative text-center px-5 space-y-7">

        {/* Badge premium */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-[11px] font-bold uppercase tracking-[4px]">
            ✦ Barbershop Premium · Cayenne
          </span>
        </div>

        {/* Nom principal */}
        <div className="space-y-1">
          <p className="display-hero shimmer-text leading-none">
            BARB'OR
          </p>
          <p className="display-hero text-white leading-none">
            GUYANE
          </p>
        </div>

        {/* Slogan séparé par une ligne gold */}
        <div className="flex items-center gap-4 justify-center">
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-gold/50" />
          <p className="text-gray-300 text-base sm:text-lg font-light tracking-[3px] uppercase italic">
            La qualité en plus.
          </p>
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* CTA */}
        <button onClick={onBook} className="btn-pill text-base px-10 py-4 font-semibold tracking-wider">
          Prendre rendez-vous
        </button>

        {/* Horaires rapides */}
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          Mar – Sam · 10h–15h &nbsp;•&nbsp; 16h–20h
        </p>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   CONCEPT SECTION
──────────────────────────────────────────────────────── */
function ConceptSection() {
  const ref = useReveal()

  return (
    <section id="concept" ref={ref} className="relative py-24 px-6 bg-black overflow-hidden">
      <div className="gold-line mb-16" />

      {/* Section number */}
      <p className="section-number absolute top-16 left-4 select-none">01</p>

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
            Plus qu'une coupe, une expérience premium. BARB'OR est né d'une vision :
            apporter l'excellence du grooming international au cœur de la Guyane.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Chaque détail est pensé pour sublimer votre style — de l'accueil premium
            à la finition parfaite. Nos barbers sont des artistes, votre style est leur toile.
          </p>
        </div>

        {/* Stats */}
        <div className="reveal delay-3 grid grid-cols-3 gap-4 pt-4">
          {[
            { value: '4.9', label: 'Note client', suffix: '★' },
            { value: '500', label: 'Clients',     suffix: '+' },
            { value: '100', label: 'Satisfaction', suffix: '%' },
          ].map(s => (
            <div key={s.label} className="text-center border-l border-gold/20 pl-4">
              <p className="font-display text-4xl text-gold leading-none">{s.value}<span className="text-2xl">{s.suffix}</span></p>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="reveal delay-4 glass-gold rounded-2xl p-6">
          <p className="text-gold font-display text-2xl tracking-wide">"BARB'OR Guyane —</p>
          <p className="text-white font-display text-2xl tracking-wide">La qualité en plus."</p>
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
  { key: 'coupe',   label: 'Coupes',    icon: '✂️' },
  { key: 'contour', label: 'Contours',  icon: '〽️' },
  { key: 'barbe',   label: 'Barbes',    icon: '🪒' },
  { key: 'pack',    label: 'Packs',     icon: '⭐' },
  { key: 'couleur', label: 'Couleur',   icon: '🎨' },
  { key: 'soin',    label: 'Soins',     icon: '💆' },
  { key: 'extra',   label: 'Extras',    icon: '⚡' },
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-all ${
                tab === t.key ? 'bg-gold text-black' : 'bg-[#0D0D0D] border border-white/10 text-gray-400 hover:text-white'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Service list */}
        <div className="space-y-2">
          {shown.map((s, i) => (
            <button key={s.id} onClick={onBook}
              className={`reveal delay-${Math.min(i+1, 5)} w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                border border-white/5 bg-[#0D0D0D]
                hover:border-gold/30 hover:bg-[#141414] hover:-translate-y-0.5
                transition-all duration-300 text-left group`}>
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
function BarbersSection({ onBook }) {
  const ref = useReveal()

  return (
    <section id="barbers" ref={ref} className="relative py-24 px-5 bg-black overflow-hidden">
      <p className="section-number absolute top-12 left-4 select-none">03</p>

      <div className="max-w-lg mx-auto">
        <div className="reveal mb-12">
          <p className="text-gold text-xs tracking-[5px] uppercase mb-3 font-bold">L'Équipe</p>
          <h2 className="display-section text-white">NOS<br/><span className="shimmer-text">BARBERS</span></h2>
          <p className="text-gray-500 mt-4 leading-relaxed">
            Des artistes passionnés, formés aux dernières techniques. Chaque barber est sélectionné pour son savoir-faire et son sens du style.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {BARBERS.map((b, i) => (
            <button key={b.id} onClick={onBook}
              className={`reveal delay-${i+1} group relative rounded-2xl overflow-hidden border border-white/5
                hover:border-gold/40 transition-all duration-300 hover:-translate-y-1`}
              style={{ aspectRatio: '3/4' }}>
              {/* Photo placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                  <span className="font-display text-2xl text-gold">{b.avatar}</span>
                </div>
              </div>
              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
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
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────
   SHOP SECTION
──────────────────────────────────────────────────────── */
function ShopSection({ onShop }) {
  const ref = useReveal()
  const featured = PRODUCTS.slice(0, 4)

  return (
    <section id="shop" ref={ref} className="relative py-24 px-5 bg-[#030303] overflow-hidden">
      <p className="section-number absolute top-12 right-4 select-none">04</p>

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
              {/* Product image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <span className="text-4xl">
                  {p.category === 'styling' ? '💈' :
                   p.category === 'soins'   ? '🧴' : '🛒'}
                </span>
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
            { icon: '⚡', label: 'Réservation\ninstantanée' },
            { icon: '💎', label: 'Qualité\ngarantie' },
            { icon: '🔔', label: 'Rappel\nautomatique' },
          ].map(f => (
            <div key={f.label} className="text-center space-y-2">
              <span className="text-2xl">{f.icon}</span>
              <p className="text-gray-500 text-xs leading-tight whitespace-pre-line">{f.label}</p>
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
function Footer({ onBook }) {
  return (
    <footer id="footer" className="bg-[#050505] border-t border-white/5 px-6 py-16 space-y-12">
      <div className="max-w-lg mx-auto space-y-10">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img src="/logo.png" alt="BARB'OR" className="h-16 w-16 object-contain"
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

        {/* Contact */}
        <div className="space-y-4">
          {[
            { icon: MapPin,    text: 'Cayenne, Guyane Française', href: '#' },
            { icon: Instagram, text: '@barbor.guyane',             href: '#' },
          ].map(({ icon: Icon, text, href }) => (
            <a key={text} href={href}
              className="flex items-center gap-4 py-3 border-b border-white/5
                text-gray-400 hover:text-gold transition-colors group">
              <Icon size={18} className="text-gold/60 group-hover:text-gold transition-colors" />
              <span className="text-sm">{text}</span>
              <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        {/* WhatsApp */}
        <a href="https://wa.me/594694000000" target="_blank" rel="noreferrer"
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

  const goBook  = () => nav('/booking')
  const goShop  = () => nav('/shop')

  return (
    <div className="bg-black">
      <Nav onBook={goBook} />
      <Hero onBook={goBook} />
      <ConceptSection />
      <ServicesSection onBook={goBook} />
      <BarbersSection onBook={goBook} />
      <ShopSection onShop={goShop} />
      <BookingCTA onBook={goBook} />
      <Footer onBook={goBook} />
    </div>
  )
}
