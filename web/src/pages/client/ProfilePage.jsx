import { APPOINTMENTS } from '../../data/mockData.js'
import { LogOut, Settings, Heart, Bell, Shield, ChevronRight } from 'lucide-react'

const STATUS_MAP = {
  confirmed: { label: 'Confirmé', cls: 'badge-green' },
  completed: { label: 'Terminé',  cls: 'badge-gray'  },
  cancelled: { label: 'Annulé',   cls: 'badge-red'   },
  pending:   { label: 'En attente',cls: 'badge-gold'  },
}

export function ProfilePage() {
  const menu = [
    { icon: Bell,    label: 'Notifications' },
    { icon: Heart,   label: 'Mes Favoris' },
    { icon: Shield,  label: 'Confidentialité' },
    { icon: Settings,label: 'Paramètres' },
  ]

  return (
    <div className="px-4 py-6 pb-8 space-y-6">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-navy to-card rounded-2xl border border-gold/20 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center border-4 border-gold/50">
              <span className="text-black font-black text-2xl">JM</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gold rounded-full px-2 py-0.5 flex items-center gap-1">
              <span className="text-[8px] font-black text-black">⭐ GOLD</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Jean MARTIN</h2>
            <p className="text-gray-400 text-sm">jean.martin@email.fr</p>
            <p className="text-gray-500 text-sm">+594 694 12 34 56</p>
          </div>
        </div>

        {/* Loyalty bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gold font-bold">Fidélité Gold — 240 pts</span>
            <span className="text-gray-500 text-xs">378 pts pour récompense</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-gold-gradient rounded-full" style={{ width: '62%' }} />
          </div>
          <p className="text-xs text-gray-500">138 points restants pour votre prochaine récompense</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: '12', l: 'Coupes', c: 'text-gold' },
            { v: '240', l: 'Points', c: 'text-yellow-400' },
            { v: '3', l: 'Commandes', c: 'text-blue-400' },
          ].map(s => (
            <div key={s.l} className="bg-black/30 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
              <p className="text-gray-500 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment history */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Mes Rendez-vous</h3>
        <div className="space-y-2">
          {APPOINTMENTS.map(a => {
            const s = STATUS_MAP[a.status]
            return (
              <div key={a.id} className="card flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/15 border border-gold/30 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-gold font-black text-lg leading-none">{a.date.split('-')[2]}</span>
                  <span className="text-gold text-[9px] font-bold">{a.date.split('-')[1] === '04' ? 'AVR' : 'MAR'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{a.service}</p>
                  <p className="text-gray-400 text-sm">avec {a.barber} · {a.time}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <p className="text-gold font-black">{a.amount}€</p>
                  <span className={s.cls}>{s.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Menu */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Paramètres</h3>
        <div className="card divide-y divide-white/5 !p-0 overflow-hidden">
          {menu.map(({ icon: Icon, label }) => (
            <button key={label} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/3 transition-colors text-left">
              <Icon size={18} className="text-gray-400" />
              <span className="flex-1 text-sm font-semibold text-white">{label}</span>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          ))}
        </div>
      </div>

      <div className="text-center space-y-3 pt-2">
        <p className="text-gray-600 text-xs tracking-widest">BARB'OR GUYANE © 2024 · v1.0.0</p>
      </div>
    </div>
  )
}
