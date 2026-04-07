import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Star, TrendingUp, Users, Award } from 'lucide-react'
import { BARBERS } from '../../data/mockData.js'

// Simulated per-barber stats
const BARBER_STATS = {
  b1: {
    rdvMonth: 94,  revenue: 2820, rating: 4.9, loyalClients: 38,
    satisfaction: { ponctualite: 97, qualite: 98, accueil: 95, proprete: 96 },
    revenueWeek: [
      { day: 'Lun', v: 420 }, { day: 'Mar', v: 380 }, { day: 'Mer', v: 560 },
      { day: 'Jeu', v: 490 }, { day: 'Ven', v: 640 }, { day: 'Sam', v: 780 }, { day: 'Dim', v: 0 },
    ],
    topService: 'Dégradé',
  },
  b2: {
    rdvMonth: 76,  revenue: 2280, rating: 4.8, loyalClients: 29,
    satisfaction: { ponctualite: 92, qualite: 95, accueil: 98, proprete: 94 },
    revenueWeek: [
      { day: 'Lun', v: 300 }, { day: 'Mar', v: 260 }, { day: 'Mer', v: 420 },
      { day: 'Jeu', v: 360 }, { day: 'Ven', v: 480 }, { day: 'Sam', v: 620 }, { day: 'Dim', v: 0 },
    ],
    topService: 'Coupe + Barbe',
  },
  b3: {
    rdvMonth: 61,  revenue: 1830, rating: 4.7, loyalClients: 21,
    satisfaction: { ponctualite: 88, qualite: 91, accueil: 94, proprete: 92 },
    revenueWeek: [
      { day: 'Lun', v: 220 }, { day: 'Mar', v: 180 }, { day: 'Mer', v: 320 },
      { day: 'Jeu', v: 280 }, { day: 'Ven', v: 360 }, { day: 'Sam', v: 470 }, { day: 'Dim', v: 0 },
    ],
    topService: 'Rasage',
  },
  b4: {
    rdvMonth: 108, revenue: 3240, rating: 4.9, loyalClients: 52,
    satisfaction: { ponctualite: 99, qualite: 99, accueil: 97, proprete: 98 },
    revenueWeek: [
      { day: 'Lun', v: 520 }, { day: 'Mar', v: 460 }, { day: 'Mer', v: 680 },
      { day: 'Jeu', v: 590 }, { day: 'Ven', v: 760 }, { day: 'Sam', v: 980 }, { day: 'Dim', v: 0 },
    ],
    topService: 'Art capillaire',
  },
  // Apprentis — stats en cours d'acquisition
  b5: {
    rdvMonth: 8, revenue: 160, rating: 0, loyalClients: 2,
    satisfaction: { ponctualite: 90, qualite: 75, accueil: 88, proprete: 92 },
    revenueWeek: [
      { day: 'Lun', v: 20 }, { day: 'Mar', v: 30 }, { day: 'Mer', v: 25 },
      { day: 'Jeu', v: 35 }, { day: 'Ven', v: 30 }, { day: 'Sam', v: 20 }, { day: 'Dim', v: 0 },
    ],
    topService: 'Coupe',
  },
  b6: {
    rdvMonth: 5, revenue: 100, rating: 0, loyalClients: 1,
    satisfaction: { ponctualite: 85, qualite: 70, accueil: 90, proprete: 88 },
    revenueWeek: [
      { day: 'Lun', v: 15 }, { day: 'Mar', v: 20 }, { day: 'Mer', v: 20 },
      { day: 'Jeu', v: 25 }, { day: 'Ven', v: 20 }, { day: 'Sam', v: 0 }, { day: 'Dim', v: 0 },
    ],
    topService: 'Coupe',
  },
}

// Ranking by revenue — barbers only (apprentices separate)
const RANKED = [...BARBERS]
  .filter(b => BARBER_STATS[b.id])
  .sort((a, b) => BARBER_STATS[b.id].revenue - BARBER_STATS[a.id].revenue)

const MEDALS = ['🥇', '🥈', '🥉']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0D1B2A] border border-gold/30 rounded-xl px-3 py-2">
      <p className="text-gold font-black text-sm">{payload[0].value}€</p>
    </div>
  )
}

export function StatsPage() {
  const [activeId, setActiveId] = useState(BARBERS[0].id)
  const stats = BARBER_STATS[activeId]
  const barber = BARBERS.find(b => b.id === activeId)
  const rank = RANKED.findIndex(b => b.id === activeId) + 1

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest text-white">Stats Barbers</h1>
        <p className="text-gray-500 text-sm">Performance individuelle — ce mois</p>
      </div>

      {/* Podium / Classement */}
      <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-gold" />
          <h2 className="font-bold text-white text-sm uppercase tracking-widest">Classement du mois</h2>
        </div>
        <div className="space-y-2">
          {RANKED.map((b, i) => {
            const s = BARBER_STATS[b.id]
            const isTop = i === 0
            return (
              <button key={b.id} onClick={() => setActiveId(b.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${activeId === b.id ? 'border-gold/40 bg-gold/5' : 'border-white/5 hover:border-white/10 hover:bg-white/2'}`}>
                <span className="text-xl w-8 text-center">{MEDALS[i] || `#${i+1}`}</span>
                <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <span className="text-gold text-xs font-black">{b.avatar}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-white text-sm">{b.firstName} {b.lastName}</p>
                  <p className="text-gray-500 text-xs">{s.rdvMonth} RDV · {s.loyalClients} clients fidèles</p>
                </div>
                <div className="text-right">
                  <p className={`font-black text-lg ${isTop ? 'text-gold' : 'text-white'}`}>{s.revenue.toLocaleString('fr-FR')}€</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={10} className="text-gold fill-gold" />
                    <span className="text-gold text-xs font-bold">{s.rating}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Barber selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {BARBERS.map(b => (
          <button key={b.id} onClick={() => setActiveId(b.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
              activeId === b.id ? 'bg-gold text-black border-gold' : 'border-white/10 text-gray-400 hover:text-white bg-[#0D0D0D]'
            }`}>
            <span>{b.avatar}</span>
            {b.firstName}
          </button>
        ))}
      </div>

      {/* Barber detail */}
      <div className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '📅', label: 'RDV ce mois',      value: stats.rdvMonth,                  color: 'text-blue-400'  },
            { icon: '💰', label: 'CA généré',         value: `${stats.revenue.toLocaleString('fr-FR')}€`, color: 'text-gold'    },
            { icon: '⭐', label: 'Note moyenne',      value: stats.rating,                    color: 'text-yellow-400'},
            { icon: '💎', label: 'Clients fidèles',   value: stats.loyalClients,              color: 'text-green-400' },
          ].map(k => (
            <div key={k.label} className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-4 text-center space-y-1">
              <span className="text-2xl">{k.icon}</span>
              <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide">{k.label}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Revenue chart */}
          <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Revenus — 7 jours</h3>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-gold" />
                <span className="text-gold text-sm font-black">
                  {stats.revenueWeek.reduce((s, d) => s + d.v, 0).toLocaleString('fr-FR')}€
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.revenueWeek} barSize={22}>
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,175,55,0.05)' }} />
                <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                  {stats.revenueWeek.map((_, i) => (
                    <Cell key={i} fill={i === 5 ? '#D4AF37' : 'rgba(212,175,55,0.25)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Satisfaction bars */}
          <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Satisfaction clients</h3>
              <div className="flex items-center gap-1">
                <span className="text-lg">{MEDALS[rank - 1] || `#${rank}`}</span>
                <span className="text-gray-500 text-xs">Rang #{rank}</span>
              </div>
            </div>
            {Object.entries(stats.satisfaction).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 capitalize">{key}</span>
                  <span className="text-gold font-bold">{val}%</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${val}%`,
                      background: val >= 95 ? 'linear-gradient(90deg, #D4AF37, #F0D060)' : 'rgba(212,175,55,0.5)',
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-gray-500">Prestation phare :</p>
              <p className="text-gold font-bold text-sm mt-0.5">✂️ {stats.topService}</p>
            </div>
          </div>
        </div>

        {/* Compared to team */}
        <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest">Comparatif équipe — CA mois</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={RANKED.map(b => ({ name: b.firstName, v: BARBER_STATS[b.id].revenue, active: b.id === activeId }))} barSize={36}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                {RANKED.map((b, i) => (
                  <Cell key={i} fill={b.id === activeId ? '#D4AF37' : 'rgba(212,175,55,0.2)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
