import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { TrendingUp, Calendar, Users, Package } from 'lucide-react'
import { STATS, REVENUE_CHART, APPOINTMENTS, BARBERS } from '../../data/mockData.js'

const PERIODS = ['day','week','month']
const PERIOD_LABELS = { day: 'Aujourd\'hui', week: 'Cette semaine', month: 'Ce mois' }

const KPI_CONFIG = [
  { key: 'revenue',      label: "Chiffre d'affaires", icon: TrendingUp, fmt: v => `${v.toLocaleString('fr-FR')}€`, color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  { key: 'appointments', label: 'Rendez-vous',         icon: Calendar,   fmt: v => v,                               color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  { key: 'fillRate',     label: 'Taux remplissage',    icon: Users,      fmt: v => `${v}%`,                         color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
  { key: 'products',     label: 'Produits vendus',     icon: Package,    fmt: v => v,                               color: '#F472B6', bg: 'rgba(244,114,182,0.1)' },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy border border-gold/30 rounded-xl px-3 py-2">
      <p className="text-gold font-black">{payload[0].value}€</p>
    </div>
  )
}

export function DashboardPage() {
  const [period, setPeriod] = useState('week')
  const stats = STATS[period]
  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Dashboard</h1>
          <p className="text-gray-500 text-sm capitalize">{today}</p>
        </div>
        {/* Period selector */}
        <div className="flex bg-surface rounded-xl p-1 border border-white/5 self-start">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                period === p ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
              }`}>
              {PERIOD_LABELS[p].split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CONFIG.map(({ key, label, icon: Icon, fmt, color, bg }) => (
          <div key={key} className="card space-y-3" style={{ borderColor: color + '25' }}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full">
                +{Math.floor(Math.random()*15+5)}%
              </span>
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color }}>{fmt(stats[key])}</p>
              <p className="text-gray-500 text-xs mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Revenus — 7 derniers jours</h2>
            <span className="text-gold text-sm font-bold">
              {REVENUE_CHART.reduce((s, d) => s + d.revenue, 0).toLocaleString('fr-FR')}€
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_CHART} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,175,55,0.06)' }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {REVENUE_CHART.map((_, i) => (
                  <Cell key={i} fill={i === 5 ? '#D4AF37' : 'rgba(212,175,55,0.3)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="font-bold text-white text-sm">Performance barbers</h2>
            {BARBERS.map(b => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <span className="text-gold text-xs font-black">{b.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{b.firstName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(b.rating/5)*100}%` }} />
                    </div>
                    <span className="text-gold text-xs font-bold">{b.rating}</span>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${b.available ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
            ))}
          </div>

          <div className="card space-y-2">
            <h2 className="font-bold text-white text-sm">Prochains RDV</h2>
            {APPOINTMENTS.filter(a => a.status === 'confirmed').slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-3 py-1 border-b border-white/5 last:border-0">
                <span className="text-gold font-bold text-sm w-12 shrink-0">{a.time}</span>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{a.client.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">{a.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent appointments table */}
      <div className="card space-y-4">
        <h2 className="font-bold text-white">Rendez-vous récents</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Heure','Client','Barber','Prestation','Montant','Statut'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-xs text-gray-500 font-bold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPOINTMENTS.map(a => {
                const s = { confirmed:'badge-green', completed:'badge-gray', pending:'badge-gold', cancelled:'badge-red' }[a.status]
                const l = { confirmed:'Confirmé', completed:'Terminé', pending:'En attente', cancelled:'Annulé' }[a.status]
                return (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4 text-gold font-bold">{a.time}</td>
                    <td className="py-3 pr-4 text-white font-medium">{a.client}</td>
                    <td className="py-3 pr-4 text-gray-400">{a.barber}</td>
                    <td className="py-3 pr-4 text-gray-300">{a.service}</td>
                    <td className="py-3 pr-4 text-gold font-black">{a.amount}€</td>
                    <td className="py-3"><span className={s}>{l}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
