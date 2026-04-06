import { BARBERS } from '../../data/mockData.js'
import { Star, TrendingUp, Users } from 'lucide-react'

const PERF = {
  b1: { clients: 67, revenue: 1640 },
  b2: { clients: 48, revenue: 1220 },
  b3: { clients: 39, revenue: 980  },
  b4: { clients: 74, revenue: 1890 },
}

export function EmployeesPage() {
  const avgRating = (BARBERS.reduce((s, b) => s + b.rating, 0) / BARBERS.length).toFixed(1)
  const totalRevenue = Object.values(PERF).reduce((s, p) => s + p.revenue, 0)

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Employés</h1>
        <p className="text-gray-500 text-sm">Performance & disponibilité des barbers</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: '💈', label: 'Barbers', value: BARBERS.length, color: 'text-gold' },
          { icon: '🟢', label: 'Disponibles', value: BARBERS.filter(b=>b.available).length, color: 'text-green-400' },
          { icon: '⭐', label: 'Note moyenne', value: avgRating, color: 'text-yellow-400' },
          { icon: '💶', label: 'Revenus total', value: `${totalRevenue.toLocaleString()}€`, color: 'text-gold' },
        ].map(s => (
          <div key={s.label} className="card text-center space-y-2">
            <span className="text-3xl">{s.icon}</span>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barber cards */}
      <div className="grid gap-4">
        {BARBERS.map(b => {
          const perf = PERF[b.id]
          const scoreWidth = `${(b.rating / 5) * 100}%`
          return (
            <div key={b.id} className="card-gold space-y-5">
              {/* Top */}
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <span className="text-gold font-black text-xl">{b.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-black text-white text-lg">{b.firstName} {b.lastName}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      b.available
                        ? 'bg-green-400/15 text-green-400 border border-green-400/30'
                        : 'bg-red-400/15 text-red-400 border border-red-400/30'
                    }`}>
                      {b.available ? '● Disponible' : '● Absent'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{b.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={13}
                        className={s <= Math.floor(b.rating) ? 'text-gold fill-gold' : 'text-gray-600'} />
                    ))}
                    <span className="text-gold font-bold text-sm ml-1">{b.rating}</span>
                    <span className="text-gray-500 text-xs">({b.reviews} avis)</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Users size={16} className="text-blue-400" />,     label: 'Clients ce mois', value: perf.clients, color: 'text-blue-400' },
                  { icon: <TrendingUp size={16} className="text-gold" />,    label: 'Revenus générés', value: `${perf.revenue}€`, color: 'text-gold' },
                  { icon: <Star size={16} className="text-pink-400 fill-pink-400"/>, label: 'Satisfaction', value: `${Math.round(b.rating * 20)}%`, color: 'text-pink-400' },
                ].map(stat => (
                  <div key={stat.label} className="bg-black/30 rounded-xl p-3 flex flex-col gap-2">
                    {stat.icon}
                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Performance globale</span>
                  <span className="text-gold font-bold">{b.rating}/5</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-gradient rounded-full transition-all" style={{ width: scoreWidth }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
