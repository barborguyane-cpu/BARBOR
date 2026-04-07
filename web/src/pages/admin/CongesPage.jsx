import { useState } from 'react'
import { Check, X, Calendar, AlertCircle } from 'lucide-react'
import { BARBERS } from '../../data/mockData.js'

const LEAVE_TYPES = {
  paye:      { label: 'Congé payé',     color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  sansSolde: { label: 'Sans solde',     color: 'text-orange-400', bg: 'bg-orange-400/10' },
  maladie:   { label: 'Arrêt maladie',  color: 'text-red-400',    bg: 'bg-red-400/10'    },
  rtt:       { label: 'RTT',            color: 'text-purple-400', bg: 'bg-purple-400/10' },
}

const INIT_REQUESTS = [
  { id: 'c1', barberId: 'b1', type: 'paye',      from: '2025-05-05', to: '2025-05-12', days: 6, reason: 'Vacances en famille',   status: 'pending'  },
  { id: 'c2', barberId: 'b2', type: 'maladie',   from: '2025-04-14', to: '2025-04-16', days: 3, reason: 'Arrêt médical',          status: 'approved' },
  { id: 'c3', barberId: 'b4', type: 'rtt',        from: '2025-04-25', to: '2025-04-25', days: 1, reason: 'RTT récupération',       status: 'pending'  },
  { id: 'c4', barberId: 'b3', type: 'paye',      from: '2025-06-01', to: '2025-06-14', days: 10, reason: 'Voyage',                status: 'pending'  },
  { id: 'c5', barberId: 'b1', type: 'sansSolde', from: '2025-03-10', to: '2025-03-12', days: 3, reason: 'Personnel',              status: 'rejected' },
  { id: 'c6', barberId: 'b2', type: 'paye',      from: '2025-07-14', to: '2025-07-25', days: 8, reason: 'Congés d\'été',          status: 'pending'  },
]

// Days used per barber (approved)
function daysUsed(requests, barberId) {
  return requests
    .filter(r => r.barberId === barberId && r.status === 'approved')
    .reduce((s, r) => s + r.days, 0)
}

const STATUS_CONFIG = {
  pending:  { label: 'En attente', color: 'text-gold',       bg: 'bg-gold/10',       dot: 'bg-gold'       },
  approved: { label: 'Approuvé',   color: 'text-green-400',  bg: 'bg-green-400/10',  dot: 'bg-green-400'  },
  rejected: { label: 'Refusé',     color: 'text-red-400',    bg: 'bg-red-400/10',    dot: 'bg-red-400'    },
}

const ANNUAL_DAYS = 25

export function CongesPage() {
  const [requests, setRequests] = useState(INIT_REQUESTS)
  const [filter, setFilter]     = useState('all')

  const approve = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
  const reject  = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r))

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === 'pending')
  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">Gestion des Congés</h1>
          <p className="text-gray-500 text-sm">Demandes et soldes de l'équipe</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-xl px-4 py-2.5">
            <AlertCircle size={16} className="text-gold" />
            <span className="text-gold font-bold text-sm">{pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente</span>
          </div>
        )}
      </div>

      {/* Solde congés par barber */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Solde congés — Année 2025</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BARBERS.map(b => {
            const used      = daysUsed(requests, b.id)
            const remaining = ANNUAL_DAYS - used
            const pct       = (used / ANNUAL_DAYS) * 100
            return (
              <div key={b.id} className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                    <span className="text-gold text-xs font-black">{b.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{b.firstName}</p>
                    <p className="text-gray-600 text-[10px]">{b.specialty.split(' ')[0]}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{used}j pris</span>
                    <span className="text-gold font-bold">{remaining}j restants</span>
                  </div>
                  <div className="h-1.5 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-gold-gradient rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-gray-600 text-[10px] mt-1 text-right">/ {ANNUAL_DAYS}j annuels</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all',     label: `Toutes (${requests.length})` },
          { key: 'pending', label: `En attente (${pendingCount})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f.key ? 'bg-gold text-black' : 'bg-[#111] border border-white/10 text-gray-400 hover:text-white'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filtered.map(req => {
          const barber = BARBERS.find(b => b.id === req.barberId)
          const lt = LEAVE_TYPES[req.type]
          const sc = STATUS_CONFIG[req.status]
          const fromDate = new Date(req.from).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
          const toDate   = new Date(req.to).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

          return (
            <div key={req.id} className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                {/* Barber avatar */}
                <div className="w-11 h-11 rounded-full bg-gold/15 border-2 border-gold/30 flex items-center justify-center shrink-0">
                  <span className="text-gold font-black">{barber?.avatar}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-white">{barber?.firstName} {barber?.lastName}</p>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${lt.color} ${lt.bg}`}>
                      {lt.label}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${sc.color} ${sc.bg}`}>
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar size={13} className="text-gray-600" />
                    <span>{fromDate} → {toDate}</span>
                    <span className="text-gold font-bold">({req.days} jour{req.days > 1 ? 's' : ''})</span>
                  </div>

                  <p className="text-gray-500 text-sm italic">"{req.reason}"</p>
                </div>

                {/* Actions */}
                {req.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approve(req.id)}
                      className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400
                        text-xs font-bold px-3 py-2 rounded-xl hover:bg-green-500/20 transition-all">
                      <Check size={13} /> Approuver
                    </button>
                    <button onClick={() => reject(req.id)}
                      className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400
                        text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-500/20 transition-all">
                      <X size={13} /> Refuser
                    </button>
                  </div>
                )}
                {req.status !== 'pending' && (
                  <div className={`text-xs font-black px-3 py-2 rounded-xl ${sc.color} ${sc.bg}`}>
                    {req.status === 'approved' ? '✅ Approuvé' : '❌ Refusé'}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucune demande en attente</p>
          </div>
        )}
      </div>
    </div>
  )
}
