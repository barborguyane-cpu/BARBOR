import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { BARBERS, SERVICES as ALL_SERVICES } from '../../data/mockData.js'

const SERVICES = ALL_SERVICES.filter(s => !s.devis)

const toMins  = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const isoDate = d => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function getWeekDates(ref) {
  const d = new Date(ref), dow = d.getDay()
  const mon = new Date(d)
  mon.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow))
  return Array.from({ length: 7 }, (_, i) => { const dd = new Date(mon); dd.setDate(mon.getDate() + i); return dd })
}

const HOUR_H    = 64
const DAY_START = 8
const DAY_END   = 20
const HOUR_LABELS = Array.from({ length: DAY_END - DAY_START }, (_, i) =>
  `${String(DAY_START + i).padStart(2, '0')}:00`
)

const B_CLR = {
  b1: '#FFD700',
  b5: '#3B82F6',
  b6: '#10B981',
}

const DAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function loadEvents() {
  try { return JSON.parse(localStorage.getItem('barbor_appointments_v1') || '[]') } catch { return [] }
}

export function PlanningPage() {
  const [current, setCurrent] = useState(new Date())
  const [events,  setEvents]  = useState(loadEvents)

  useEffect(() => {
    const h = () => setEvents(loadEvents())
    window.addEventListener('barbor_appointments_update', h)
    return () => window.removeEventListener('barbor_appointments_update', h)
  }, [])

  const dates = getWeekDates(current)
  const nav   = dir => { const d = new Date(current); d.setDate(d.getDate() + dir * 7); setCurrent(d) }
  const today  = isoDate(new Date())

  const dayEvs = d => events
    .filter(e => e.date === isoDate(d) && e.type === 'appointment')
    .sort((a, b) => toMins(a.start) - toMins(b.start))

  const svcName = id => SERVICES.find(s => s.id === id)?.name || 'Prestation'
  const barber  = id => BARBERS.find(b => b.id === id)

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={18} className="text-gold" />
          <h1 className="text-xl font-black uppercase tracking-widest">Planning</h1>
        </div>
        <p className="text-gray-500 text-xs">Disponibilités en temps réel — prestations uniquement</p>
      </div>

      {/* Nav semaine */}
      <div className="flex items-center justify-between px-4 mb-4">
        <button onClick={() => nav(-1)} className="p-2 rounded-xl bg-surface border border-white/10 text-white hover:border-gold/30 transition-all">
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-bold text-white">
          {dates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          {' — '}
          {dates[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <button onClick={() => nav(1)} className="p-2 rounded-xl bg-surface border border-white/10 text-white hover:border-gold/30 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grille */}
      <div className="px-2 overflow-x-auto">
        <div className="flex min-w-[360px]">

          {/* Colonne heures */}
          <div className="w-12 shrink-0 pt-8">
            {HOUR_LABELS.map(h => (
              <div key={h} style={{ height: HOUR_H }} className="flex items-start justify-end pr-2">
                <span className="text-[10px] text-gray-600">{h}</span>
              </div>
            ))}
          </div>

          {/* Colonnes jours */}
          {dates.map((d, di) => {
            const isToday = isoDate(d) === today
            const evs = dayEvs(d)
            return (
              <div key={di} className="flex-1 min-w-0">
                {/* Header jour */}
                <div className={`text-center pb-2 border-b ${isToday ? 'border-gold/50' : 'border-white/5'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-gold' : 'text-gray-500'}`}>
                    {DAY_SHORT[di]}
                  </p>
                  <p className={`text-sm font-black ${isToday ? 'text-gold' : 'text-white'}`}>
                    {d.getDate()}
                  </p>
                </div>

                {/* Grille horaire */}
                <div className="relative" style={{ height: (DAY_END - DAY_START) * HOUR_H }}>
                  {/* Lignes heure */}
                  {HOUR_LABELS.map((_, i) => (
                    <div key={i} className="absolute left-0 right-0 border-t border-white/5"
                      style={{ top: i * HOUR_H }} />
                  ))}

                  {/* Événements — prestation + durée UNIQUEMENT */}
                  {evs.map(ev => {
                    const top = (toMins(ev.start) - DAY_START * 60) / 60 * HOUR_H
                    const h   = (toMins(ev.end) - toMins(ev.start)) / 60 * HOUR_H
                    const b   = barber(ev.barberId)
                    const clr = B_CLR[ev.barberId] || '#FFD700'
                    const dur = toMins(ev.end) - toMins(ev.start)
                    return (
                      <div key={ev.id}
                        className="absolute left-0.5 right-0.5 rounded-lg overflow-hidden"
                        style={{ top, height: Math.max(h, 22), backgroundColor: clr + '22', borderLeft: `2px solid ${clr}` }}>
                        <div className="px-1 pt-0.5">
                          <p className="text-[9px] font-black leading-tight truncate" style={{ color: clr }}>
                            {ev.start} · {dur}min
                          </p>
                          <p className="text-[9px] text-white/80 leading-tight truncate">
                            {svcName(ev.svcId)}
                          </p>
                          {b && h > 36 && (
                            <p className="text-[8px] text-white/40 truncate">{b.firstName}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Légende barbers */}
      <div className="px-4 mt-6 flex flex-wrap gap-3">
        {BARBERS.map(b => (
          <div key={b.id} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: B_CLR[b.id] || '#FFD700' }} />
            <span className="text-xs text-gray-400">{b.firstName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
