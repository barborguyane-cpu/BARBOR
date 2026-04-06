import { useNavigate } from 'react-router-dom'
import { Calendar, ShoppingBag, Car, Star, ChevronRight, Clock } from 'lucide-react'
import { Logo } from '../../components/common/Logo.jsx'
import { PROMOTIONS, APPOINTMENTS } from '../../data/mockData.js'

const nextApt = APPOINTMENTS.find(a => a.status === 'confirmed')

export function HomePage() {
  const nav = useNavigate()

  const actions = [
    { icon: Calendar,    label: 'Réserver\nun RDV',       to: '/booking', color: 'gold',  glow: '#D4AF3740' },
    { icon: ShoppingBag, label: 'Ma\nBoutique',           to: '/shop',    color: 'blue',  glow: '#60A5FA40' },
    { icon: Car,         label: "BARB'\nDRIVER",          to: '/driver',  color: 'green', glow: '#34D39940' },
  ]

  return (
    <div className="pb-4">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-navy to-black px-6 py-12 flex flex-col items-center overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gold/3 blur-2xl" />
        <Logo size={110} variant="gold" />
        <h1 className="text-5xl font-black tracking-[10px] gradient-text mt-5">BARB'OR</h1>
        <p className="text-gray-400 tracking-[8px] text-sm font-light">GUYANE</p>
        <div className="h-px w-20 bg-gold/60 my-4" />
        <p className="text-gray-600 text-xs tracking-[3px] uppercase">✦ L'EXCELLENCE AU SERVICE DE VOTRE STYLE ✦</p>
      </div>

      <div className="px-4 space-y-6 mt-6">
        {/* Main actions */}
        <div className="grid grid-cols-3 gap-3">
          {actions.map(({ icon: Icon, label, to, color, glow }) => (
            <button
              key={to}
              onClick={() => nav(to)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/10 bg-surface
                         hover:border-gold/40 hover:scale-105 transition-all duration-200 active:scale-95"
              style={{ boxShadow: `0 0 20px ${glow}` }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: glow }}>
                <Icon size={22} style={{ color:
                  color === 'gold' ? '#D4AF37' :
                  color === 'blue' ? '#60A5FA' : '#34D399'
                }} />
              </div>
              <span className="text-xs font-bold text-center leading-tight whitespace-pre-line"
                style={{ color:
                  color === 'gold' ? '#D4AF37' :
                  color === 'blue' ? '#60A5FA' : '#34D399'
                }}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Next appointment */}
        {nextApt && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Prochain Rendez-vous</h2>
            <button onClick={() => nav('/profile')}
              className="w-full card-gold flex items-center gap-4 hover:border-gold/50 transition-all text-left">
              <div className="w-14 h-14 bg-gold rounded-xl flex flex-col items-center justify-center shrink-0">
                <span className="text-black text-2xl font-black leading-none">10</span>
                <span className="text-black text-xs font-bold">AVR</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">{nextApt.service}</p>
                <p className="text-gray-400 text-sm">avec {nextApt.barber}</p>
                <p className="text-gold text-sm flex items-center gap-1 mt-1">
                  <Clock size={12} /> {nextApt.time}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="badge-green">CONFIRMÉ</span>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </button>
          </div>
        )}

        {/* Promotions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Offres & Actualités</h2>
            <span className="text-gold text-xs cursor-pointer hover:underline">Voir tout</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {PROMOTIONS.map(p => (
              <div key={p.id} className="shrink-0 w-72 rounded-2xl p-5 bg-gold-gradient cursor-pointer
                hover:opacity-90 hover:scale-[1.02] transition-all">
                <h3 className="font-black text-black text-base">{p.title}</h3>
                <p className="text-black/70 text-sm mt-1 leading-snug">{p.desc}</p>
                {p.code && (
                  <div className="mt-3 bg-black/15 rounded-lg px-3 py-1 inline-block">
                    <span className="text-black font-black text-xs tracking-[2px]">CODE : {p.code}</span>
                  </div>
                )}
                <p className="text-black/50 text-xs mt-2">Jusqu'au {p.expiry}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Votre Espace</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '✂️', label: 'Coupes', value: '12', color: 'text-gold' },
              { icon: '⭐', label: 'Pts Gold', value: '240', color: 'text-yellow-400' },
              { icon: '📦', label: 'Commandes', value: '3', color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="card flex flex-col items-center gap-2 py-4">
                <span className="text-2xl">{s.icon}</span>
                <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                <span className="text-xs text-gray-500 font-semibold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
