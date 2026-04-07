import { useNavigate } from 'react-router-dom'
import { Calendar, ShoppingBag, Car, Star, ChevronRight, Clock, Plus, Scissors } from 'lucide-react'
import { Logo } from '../../components/common/Logo.jsx'
import { PROMOTIONS, APPOINTMENTS, BARBERS } from '../../data/mockData.js'

const upcomingApts = APPOINTMENTS.filter(a => a.status === 'confirmed' || a.status === 'pending')

export function HomePage({ auth, onRequireAuth }) {
  const nav = useNavigate()

  return (
    <div className="pb-24">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0D1B2A] via-[#0a1220] to-black">
        {/* Ambient glows */}
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gold/8 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-blue-900/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center px-6 pt-10 pb-12 gap-5">
          {/* Logo with glow ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl scale-125" />
            <div className="relative ring-2 ring-gold/30 rounded-full p-1">
              <Logo size={120} variant="gold" />
            </div>
          </div>

          {/* Brand name */}
          <div className="flex flex-col items-center gap-1 mt-1">
            <h1 className="text-5xl font-black tracking-[12px] gradient-text leading-none">BARB'OR</h1>
            <p className="text-gray-400 tracking-[10px] text-xs font-light uppercase">Guyane</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold/70 text-xs">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          {/* Slogan */}
          <div className="text-center space-y-1">
            <p className="text-white/90 text-base font-bold tracking-[2px] uppercase">
              L'excellence au service
            </p>
            <p className="text-gold text-base font-bold tracking-[2px] uppercase">
              de votre style
            </p>
          </div>

          {/* Sub-slogan */}
          <p className="text-gray-500 text-xs tracking-[3px] uppercase text-center">
            Barbershop Premium · Cayenne · Guyane
          </p>

          {/* CTA principal */}
          <button
            onClick={() => nav('/booking')}
            className="mt-2 btn-gold flex items-center gap-2 px-8 py-3 text-sm font-black tracking-[2px] uppercase shadow-lg shadow-gold/20"
          >
            <Calendar size={16} />
            Prendre un Rendez-vous
          </button>
        </div>
      </div>

      <div className="px-4 space-y-7 mt-6">

        {/* ── ACTIONS RAPIDES ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Calendar,    label: 'Réserver\nun RDV',  to: '/booking', color: '#D4AF37', bg: '#D4AF3718' },
            { icon: ShoppingBag, label: 'Ma\nBoutique',      to: '/shop',    color: '#60A5FA', bg: '#60A5FA18' },
            { icon: Car,         label: "BARB'\nDRIVER",     to: '/driver',  color: '#34D399', bg: '#34D39918' },
          ].map(({ icon: Icon, label, to, color, bg }) => (
            <button
              key={to}
              onClick={() => nav(to)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/10 bg-surface
                         hover:border-white/25 hover:scale-105 active:scale-95 transition-all duration-200"
              style={{ boxShadow: `0 0 24px ${color}18` }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={22} style={{ color }} />
              </div>
              <span className="text-xs font-bold text-center leading-tight whitespace-pre-line" style={{ color }}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* ── MES RENDEZ-VOUS ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Mes Rendez-vous</h2>
            <button
              onClick={() => nav('/booking')}
              className="flex items-center gap-1 text-gold text-xs font-bold hover:underline"
            >
              <Plus size={12} /> Nouveau
            </button>
          </div>

          {upcomingApts.length === 0 ? (
            <div className="card flex flex-col items-center py-10 gap-4 border-dashed border-gold/20">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
                <Scissors size={24} className="text-gold/60" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold">Aucun rendez-vous</p>
                <p className="text-gray-500 text-sm mt-1">Réservez votre prochain créneau</p>
              </div>
              <button onClick={() => nav('/booking')} className="btn-gold text-sm px-6">
                Réserver maintenant
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingApts.map((apt) => {
                const dateObj = new Date(apt.date)
                const day     = dateObj.getDate()
                const month   = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase().slice(0, 3)
                const weekday = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' })
                const isConfirmed = apt.status === 'confirmed'

                return (
                  <button
                    key={apt.id}
                    onClick={() => nav('/profile')}
                    className="w-full card-gold flex items-center gap-4 hover:border-gold/60 hover:scale-[1.01] active:scale-[0.99] transition-all text-left"
                  >
                    {/* Date badge */}
                    <div className="w-14 h-16 bg-gold rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md shadow-gold/30">
                      <span className="text-black text-2xl font-black leading-none">{day}</span>
                      <span className="text-black/70 text-xs font-bold">{month}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white capitalize">{apt.service}</p>
                      <p className="text-gray-400 text-sm mt-0.5">avec <span className="text-white/80 font-semibold">{apt.barber}</span></p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock size={11} /> {apt.time}
                        </span>
                        <span className="text-gray-600 text-xs capitalize">{weekday}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {isConfirmed
                        ? <span className="badge-green">Confirmé</span>
                        : <span className="badge-gold">En attente</span>
                      }
                      <span className="text-gold font-black text-sm">{apt.amount}€</span>
                    </div>
                  </button>
                )
              })}

              {/* Voir historique */}
              <button onClick={() => nav('/profile')} className="w-full text-center text-gray-500 text-xs hover:text-gold transition-colors py-2 flex items-center justify-center gap-1">
                Voir tout l'historique <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* ── NOS BARBERS ── */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-3">Nos Barbers</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {BARBERS.map(b => (
              <button
                key={b.id}
                onClick={() => nav('/booking')}
                className="shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/10 bg-surface
                           hover:border-gold/40 hover:scale-105 active:scale-95 transition-all w-32"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                    <span className="text-gold font-black text-lg">{b.avatar}</span>
                  </div>
                  {b.available && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xs leading-tight">{b.firstName}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5 leading-tight line-clamp-2">{b.specialty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-gold fill-gold" />
                  <span className="text-gold text-[10px] font-bold">{b.rating}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── OFFRES & PROMOS ── */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Offres du Moment</h2>
            <span className="text-gold text-xs cursor-pointer hover:underline">Tout voir</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {PROMOTIONS.map(p => (
              <div
                key={p.id}
                className="shrink-0 w-72 rounded-2xl p-5 bg-gold-gradient cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-gold/20"
              >
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

        {/* ── MON ESPACE ── */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-3">Mon Espace Gold</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '✂️', label: 'Coupes', value: '12',  color: 'text-gold' },
              { icon: '⭐', label: 'Pts Gold', value: '240', color: 'text-yellow-400' },
              { icon: '📦', label: 'Commandes', value: '3',  color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="card flex flex-col items-center gap-2 py-5">
                <span className="text-2xl">{s.icon}</span>
                <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
          {/* Gold bar */}
          <div className="mt-3 card-gold space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-semibold">Statut Gold</span>
              <span className="text-gold font-black">240 / 300 pts</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-gold-gradient rounded-full transition-all" style={{ width: '80%' }} />
            </div>
            <p className="text-gray-500 text-[10px]">Plus que 60 pts pour débloquer le niveau Platinum ✨</p>
          </div>
        </div>

      </div>
    </div>
  )
}
