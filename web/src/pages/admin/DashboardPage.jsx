import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { TrendingUp, Calendar, Users, Package, Clock, ArrowUp, ArrowDown } from 'lucide-react'
import { STATS, REVENUE_CHART, APPOINTMENTS, BARBERS } from '../../data/mockData.js'

const PERIODS = ['day','week','month']
const PERIOD_LABELS = { day: "Aujourd'hui", week: 'Cette semaine', month: 'Ce mois' }

// Simulated J-1 comparison data
const PREV = { day: { revenue: 290, appointments: 10 }, week: { revenue: 1540, appointments: 58 }, month: { revenue: 7600, appointments: 245 } }

const KPI_CONFIG = [
  { key: 'revenue',      label: "Chiffre d'affaires", icon: TrendingUp, fmt: v => `${v.toLocaleString('fr-FR')}€`, color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
  { key: 'appointments', label: 'Rendez-vous',         icon: Calendar,   fmt: v => v,                               color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  { key: 'fillRate',     label: 'Taux remplissage',    icon: Users,      fmt: v => `${v}%`,                         color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
  { key: 'products',     label: 'Produits vendus',     icon: Package,    fmt: v => v,                               color: '#F472B6', bg: 'rgba(244,114,182,0.1)' },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0D1B2A] border border-gold/30 rounded-xl px-3 py-2">
      <p className="text-gold font-black">{payload[0].value}€</p>
    </div>
  )
}

function pct(curr, prev) {
  if (!prev) return 0
  return Math.round(((curr - prev) / prev) * 100)
}

export function DashboardPage() {
  const [period, setPeriod] = useState('day')
  const [clock, setClock]   = useState(new Date())
  const stats = STATS[period]
  const prev  = PREV[period]

  // Real-time clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const timeStr = clock.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const rdvRestants = APPOINTMENTS.filter(a => a.status === 'confirmed' || a.status === 'pending').length
  const revDelta    = pct(stats.revenue, prev.revenue)
  const aptDelta    = pct(stats.appointments, prev.appointments)

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Live clock */}
          <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-xl px-4 py-2">
            <Clock size={14} className="text-gold" />
            <span className="text-white font-mono font-bold text-sm tabular-nums">{timeStr}</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          {/* Period selector */}
          <div className="flex bg-[#111] rounded-xl p-1 border border-white/5">
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
      </div>

      {/* ── Quick info bar ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'CA du jour', value: `${STATS.day.revenue}€`, sub: revDelta >= 0 ? `+${revDelta}% vs J-1` : `${revDelta}% vs J-1`, up: revDelta >= 0 },
          { label: 'RDV restants', value: rdvRestants, sub: 'à confirmer aujourd\'hui', up: true },
          { label: 'Nouveaux clients', value: STATS.day.newClients, sub: 'inscriptions aujourd\'hui', up: true },
        ].map(({ label, value, sub, up }) => (
          <div key={label} className="bg-[#0D0D0D] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className={`text-xs mt-1 flex items-center justify-center gap-1 ${up ? 'text-green-400' : 'text-red-400'}`}>
              {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CONFIG.map(({ key, label, icon: Icon, fmt, color, bg }) => {
          const delta = key === 'revenue' ? revDelta : key === 'appointments' ? aptDelta : Math.floor(Math.random()*12+3)
          return (
            <div key={key} className="bg-[#0D0D0D] rounded-2xl border p-5 space-y-3" style={{ borderColor: color + '20' }}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${delta >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {delta >= 0 ? <ArrowUp size={10}/> : <ArrowDown size={10}/>}{Math.abs(delta)}%
                </span>
              </div>
              <div>
                <p className="text-3xl font-black" style={{ color }}>{fmt(stats[key])}</p>
                <p className="text-gray-500 text-xs mt-1">{label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-[#0D0D0D] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Revenus — 7 derniers jours</h2>
            <span className="text-gold text-sm font-black">
              {REVENUE_CHART.reduce((s, d) => s + d.revenue, 0).toLocaleString('fr-FR')}€
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_CHART} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,175,55,0.05)' }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {REVENUE_CHART.map((_, i) => (
                  <Cell key={i} fill={i === 5 ? '#D4AF37' : 'rgba(212,175,55,0.25)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Barbers status */}
          <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 space-y-3">
            <h2 className="font-bold text-white text-sm">Barbers — Statut du jour</h2>
            {BARBERS.map(b => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                    <span className="text-gold text-xs font-black">{b.avatar}</span>
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0D0D0D] ${b.available ? 'bg-green-400' : 'bg-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{b.firstName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 h-1 bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-gold-gradient rounded-full" style={{ width: `${(b.rating/5)*100}%` }} />
                    </div>
                    <span className="text-gold text-[10px] font-bold">{b.rating}★</span>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.available ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-white/5'}`}>
                  {b.available ? 'Dispo' : 'Off'}
                </span>
              </div>
            ))}
          </div>

          {/* Next RDV */}
          <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 space-y-2">
            <h2 className="font-bold text-white text-sm">Prochains RDV</h2>
            {APPOINTMENTS.filter(a => a.status === 'confirmed').slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="text-gold font-black text-sm w-12 shrink-0">{a.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white font-medium truncate">{a.client.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">{a.service}</p>
                </div>
                <span className="text-gold font-black text-sm">{a.amount}€</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Appointments table ── */}
      <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-white">Tous les rendez-vous</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Heure','Client','Barber','Prestation','Montant','Statut'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-xs text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPOINTMENTS.map(a => {
                const sc = { confirmed:'badge-green', completed:'badge-gray', pending:'badge-gold', cancelled:'badge-red' }[a.status]
                const sl = { confirmed:'Confirmé', completed:'Terminé', pending:'En attente', cancelled:'Annulé' }[a.status]
                return (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4 text-gold font-bold whitespace-nowrap">{a.time}</td>
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">{a.client}</td>
                    <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">{a.barber}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{a.service}</td>
                    <td className="py-3 pr-4 text-gold font-black whitespace-nowrap">{a.amount}€</td>
                    <td className="py-3"><span className={sc}>{sl}</span></td>
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
