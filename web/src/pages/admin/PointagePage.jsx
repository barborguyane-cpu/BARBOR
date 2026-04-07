import { useState, useEffect } from 'react'
import { Clock, LogIn, LogOut, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { BARBERS } from '../../data/mockData.js'

// Generate last 7 days labels
function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
  })
}

// Simulated history data
function genHistory(available) {
  return last7Days().map((day, i) => ({
    day,
    status: i === 6 ? (available ? 'present' : 'absent')
           : i === 4 ? 'absent'
           : 'present',
    arrival: i < 6 ? `0${8 + Math.floor(Math.random()*2)}:${Math.random()>0.5?'00':'30'}` : null,
    departure: i < 6 ? `${17 + Math.floor(Math.random()*2)}:${Math.random()>0.5?'00':'30'}` : null,
    hours: i < 6 ? `${7 + Math.floor(Math.random()*2)}h${Math.random()>0.5?'00':'30'}` : '-',
  }))
}

const INITIAL_STATE = BARBERS.map(b => ({
  ...b,
  arrival:   b.available ? '08:30' : null,
  departure: null,
  status:    b.available ? 'present' : 'absent', // present | absent | conge
  totalHours: null,
  history: genHistory(b.available),
}))

function timeDiff(arrival, departure) {
  if (!arrival || !departure) return null
  const [ah, am] = arrival.split(':').map(Number)
  const [dh, dm] = departure.split(':').map(Number)
  const mins = (dh * 60 + dm) - (ah * 60 + am)
  return `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, '0')}`
}

const STATUS_CONFIG = {
  present: { label: 'Présent',  color: 'text-green-400',  bg: 'bg-green-400/10',  dot: 'bg-green-400' },
  absent:  { label: 'Absent',   color: 'text-red-400',    bg: 'bg-red-400/10',    dot: 'bg-red-400'   },
  conge:   { label: 'Congé',    color: 'text-blue-400',   bg: 'bg-blue-400/10',   dot: 'bg-blue-400'  },
}

export function PointagePage() {
  const [barbers, setBarbers] = useState(INITIAL_STATE)
  const [clock, setClock]     = useState(new Date())
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const now = clock.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const markArrival = (id) => {
    setBarbers(prev => prev.map(b => b.id === id
      ? { ...b, arrival: now, status: 'present' }
      : b
    ))
  }

  const markDeparture = (id) => {
    setBarbers(prev => prev.map(b => {
      if (b.id !== id) return b
      const total = timeDiff(b.arrival, now)
      return { ...b, departure: now, totalHours: total }
    }))
  }

  const markConge = (id) => {
    setBarbers(prev => prev.map(b => b.id === id
      ? { ...b, status: 'conge', arrival: null, departure: null }
      : b
    ))
  }

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const presentCount = barbers.filter(b => b.status === 'present').length
  const absentCount  = barbers.filter(b => b.status === 'absent').length
  const congeCount   = barbers.filter(b => b.status === 'conge').length

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">Pointage</h1>
          <p className="text-gray-500 text-sm capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-xl px-4 py-2.5">
          <Clock size={14} className="text-gold" />
          <span className="text-white font-mono font-black text-base tabular-nums">{clock.toLocaleTimeString('fr-FR')}</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* Day summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Présents', value: presentCount, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
          { label: 'Absents',  value: absentCount,  color: 'text-red-400',   bg: 'bg-red-400/10',   border: 'border-red-400/20'   },
          { label: 'Congés',   value: congeCount,   color: 'text-blue-400',  bg: 'bg-blue-400/10',  border: 'border-blue-400/20'  },
        ].map(s => (
          <div key={s.label} className={`${s.bg} ${s.border} border rounded-2xl p-4 text-center`}>
            <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barber rows */}
      <div className="space-y-3">
        {barbers.map(b => {
          const sc = STATUS_CONFIG[b.status]
          return (
            <div key={b.id} className="bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden">
              {/* Main row */}
              <div className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gold/15 border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-black">{b.avatar}</span>
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0D0D0D] ${sc.dot}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{b.firstName} {b.lastName}</p>
                  <p className="text-gray-500 text-xs">{b.specialty}</p>
                </div>

                {/* Status badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${sc.color} ${sc.bg}`}>
                  {sc.label}
                </span>

                {/* Arrival / Departure times */}
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">Arrivée</p>
                    <p className="text-white font-bold">{b.arrival || '—'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">Départ</p>
                    <p className="text-white font-bold">{b.departure || '—'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">Total</p>
                    <p className="text-gold font-black">{b.totalHours || (b.arrival && !b.departure ? timeDiff(b.arrival, now) + '*' : '—')}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {!b.arrival && b.status !== 'conge' && (
                    <button onClick={() => markArrival(b.id)}
                      className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400
                        text-xs font-bold px-3 py-2 rounded-xl hover:bg-green-500/20 transition-all">
                      <LogIn size={12} /> Arrivée
                    </button>
                  )}
                  {b.arrival && !b.departure && (
                    <button onClick={() => markDeparture(b.id)}
                      className="flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-gold
                        text-xs font-bold px-3 py-2 rounded-xl hover:bg-gold/20 transition-all">
                      <LogOut size={12} /> Départ
                    </button>
                  )}
                  {b.status !== 'conge' && !b.arrival && (
                    <button onClick={() => markConge(b.id)}
                      className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400
                        text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-500/20 transition-all">
                      Congé
                    </button>
                  )}
                  <button onClick={() => setSelected(selected === b.id ? null : b.id)}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-400
                      text-xs font-bold px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
                    <Calendar size={12} /> Historique
                  </button>
                </div>
              </div>

              {/* History panel */}
              {selected === b.id && (
                <div className="border-t border-white/5 p-4 bg-black/30">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Historique 7 jours</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          {['Jour', 'Statut', 'Arrivée', 'Départ', 'Heures'].map(h => (
                            <th key={h} className="text-left py-2 pr-4 text-gray-600 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {b.history.map((h, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-2 pr-4 text-gray-300 capitalize">{h.day}</td>
                            <td className="py-2 pr-4">
                              <span className={`font-bold ${STATUS_CONFIG[h.status].color}`}>
                                {h.status === 'present' ? <CheckCircle size={12} className="inline mr-1" /> : <XCircle size={12} className="inline mr-1" />}
                                {STATUS_CONFIG[h.status].label}
                              </span>
                            </td>
                            <td className="py-2 pr-4 text-gray-400">{h.arrival || '—'}</td>
                            <td className="py-2 pr-4 text-gray-400">{h.departure || '—'}</td>
                            <td className="py-2 text-gold font-bold">{h.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
