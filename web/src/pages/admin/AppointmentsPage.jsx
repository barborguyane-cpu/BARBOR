import { useState } from 'react'
import { APPOINTMENTS, BARBERS } from '../../data/mockData.js'
import { Search, Filter } from 'lucide-react'

const STATUS_MAP = {
  confirmed: { label: 'Confirmé',  cls: 'badge-green' },
  completed: { label: 'Terminé',   cls: 'badge-gray'  },
  pending:   { label: 'En attente',cls: 'badge-gold'   },
  cancelled: { label: 'Annulé',    cls: 'badge-red'    },
}

export function AppointmentsPage() {
  const [filterBarber, setFilterBarber] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = APPOINTMENTS.filter(a => {
    const matchB = filterBarber === 'all' || a.barber.includes(filterBarber)
    const matchS = filterStatus === 'all' || a.status === filterStatus
    const matchQ = a.client.toLowerCase().includes(search.toLowerCase()) ||
                   a.service.toLowerCase().includes(search.toLowerCase())
    return matchB && matchS && matchQ
  })

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Planning & RDV</h1>
        <p className="text-gray-500 text-sm">{filtered.length} rendez-vous</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-4 py-2 flex-1 min-w-48">
          <Search size={16} className="text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher client, service..."
            className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-gray-600" />
        </div>
        <select value={filterBarber} onChange={e => setFilterBarber(e.target.value)}
          className="bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold">
          <option value="all">Tous les barbers</option>
          {BARBERS.map(b => <option key={b.id} value={b.firstName}>{b.firstName} {b.lastName}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold">
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="grid gap-3">
        {filtered.map(a => {
          const s = STATUS_MAP[a.status]
          return (
            <div key={a.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-1 h-full self-stretch rounded-full shrink-0 ${
                  a.status === 'confirmed' ? 'bg-green-400' :
                  a.status === 'completed' ? 'bg-gray-500' :
                  a.status === 'pending'   ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <div className="w-12 text-center shrink-0">
                  <p className="text-gold font-black text-lg">{a.time}</p>
                  <p className="text-gray-500 text-xs">{a.date.split('-').slice(1).join('/')}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{a.client}</p>
                  <p className="text-gray-400 text-sm">{a.service}</p>
                  <p className="text-gray-500 text-xs">Barber : {a.barber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end">
                <div className="text-right">
                  <p className="text-gold font-black text-xl">{a.amount}€</p>
                  {a.deposit > 0 && <p className="text-green-400 text-xs">✅ Acompte {a.deposit}€</p>}
                </div>
                <span className={s.cls}>{s.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p>Aucun rendez-vous trouvé</p>
        </div>
      )}
    </div>
  )
}
