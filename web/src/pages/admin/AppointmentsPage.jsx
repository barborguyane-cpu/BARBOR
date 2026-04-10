import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Check, Trash2, Calendar as CalIcon } from 'lucide-react'
import { BARBERS, SERVICES as ALL_SERVICES } from '../../data/mockData.js'
import { subscribeAppointments, addAppointmentFS, updateAppointmentFS, deleteAppointmentFS } from '../../data/firestoreData.js'

const SERVICES = ALL_SERVICES.filter(s => !s.devis)

// ── Time utils ────────────────────────────────────────────────────────────────
const toMins  = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const addMins = (t, n) => {
  const tot = toMins(t) + n
  return `${String(~~(tot / 60)).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`
}
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

// ── Constants ─────────────────────────────────────────────────────────────────
const HOUR_H    = 72
const DAY_START = 8
const DAY_END   = 20
const GRID_H    = (DAY_END - DAY_START) * HOUR_H

const HOUR_LABELS = Array.from({ length: DAY_END - DAY_START }, (_, i) =>
  `${String(DAY_START + i).padStart(2, '0')}:00`
)

// Per-barber color (gold = Christopher, blue = Chadrac)
const B_CLR = {
  b1: { bg: 'rgba(212,175,55,0.85)',  border: '#D4AF37', dot: '#D4AF37' },
  b5: { bg: 'rgba(59,130,246,0.80)',  border: '#3B82F6', dot: '#3B82F6' },
}
const DEF_CLR = B_CLR.b5

// ── Overlap layout algorithm ─────────────────────────────────────────────────
function layoutDay(evs) {
  const sorted = [...evs].sort((a, b) => toMins(a.start) - toMins(b.start))
  const cols = []
  const placed = sorted.map(ev => {
    let c = cols.findIndex(col => toMins(col[col.length - 1].end) <= toMins(ev.start))
    if (c === -1) { c = cols.length; cols.push([]) }
    cols[c].push(ev)
    return { ...ev, _c: c }
  })
  const n = cols.length
  return placed.map(ev => ({ ...ev, _n: n }))
}

// ── ID ────────────────────────────────────────────────────────────────────────
let _uid = 1
const nextId = () => `ev${_uid++}`

// ── Default form ─────────────────────────────────────────────────────────────
const BLANK = {
  type: 'appointment',
  clientName: '',
  svcId: SERVICES[0]?.id || 's1',
  barberId: BARBERS[0]?.id || 'b5',
  date: '',
  start: '10:00',
  end: '10:30',
  amount: SERVICES[0]?.price || 20,
  paid: false,
  notes: '',
  breakLabel: 'Pause déjeuner',
}

// ── EventModal ────────────────────────────────────────────────────────────────
function EventModal({ init, isEdit, onSave, onDelete, onClose }) {
  const [f, setF] = useState(init)
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const onSvc = id => {
    const s = SERVICES.find(x => x.id === id)
    setF(p => ({ ...p, svcId: id, amount: s?.price || 0, end: addMins(p.start, s?.duration || 30) }))
  }
  const onStart = v => {
    const s = SERVICES.find(x => x.id === f.svcId)
    setF(p => ({ ...p, start: v, end: addMins(v, s?.duration || 30) }))
  }

  const valid = f.type === 'break'
    ? (f.date && f.start && f.end && f.start < f.end)
    : (f.clientName.trim() && f.date && f.start && f.end && f.start < f.end)

  const save = () => { if (valid) { onSave(f); onClose() } }

  const inp = 'w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-white/30 transition-colors'
  const lbl = 'text-xs text-gray-500 uppercase tracking-widest block mb-1.5'

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-black text-white text-lg uppercase tracking-widest">
            {isEdit ? 'Modifier' : f.type === 'break' ? 'Pause / Fermeture' : 'Nouveau RDV'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Type toggle — new only */}
          {!isEdit && (
            <div className="flex gap-2">
              {[['appointment', '✂️ Rendez-vous'], ['break', '⏸ Pause / Fermeture']].map(([k, l]) => (
                <button key={k} onClick={() => set('type', k)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all ${
                    f.type === k ? 'bg-gold/20 border-gold text-gold' : 'border-white/10 text-gray-500 hover:text-white'
                  }`}>{l}</button>
              ))}
            </div>
          )}

          {f.type === 'appointment' ? (
            <>
              {/* Client */}
              <div>
                <label className={lbl}>Client *</label>
                <input value={f.clientName}
                  onChange={e => set('clientName', e.target.value.toUpperCase())}
                  placeholder="NOM PRÉNOM" autoFocus className={inp} />
              </div>

              {/* Barber */}
              <div>
                <label className={lbl}>Barber</label>
                <div className="flex gap-2 mt-1">
                  {BARBERS.map(b => (
                    <button key={b.id} onClick={() => set('barberId', b.id)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        f.barberId === b.id ? 'bg-gold/20 border-gold text-gold' : 'border-white/10 text-gray-500 hover:text-white'
                      }`}>
                      {b.avatar} {b.firstName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service */}
              <div>
                <label className={lbl}>Prestation</label>
                <select value={f.svcId} onChange={e => onSvc(e.target.value)} className={inp}>
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.duration}min — {s.price}€</option>
                  ))}
                </select>
              </div>

              {/* Date + times */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={lbl}>Date *</label>
                  <input type="date" value={f.date} onChange={e => set('date', e.target.value)} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Début</label>
                  <input type="time" value={f.start} onChange={e => onStart(e.target.value)} step="300" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Fin</label>
                  <input type="time" value={f.end} onChange={e => set('end', e.target.value)} step="300" className={inp} />
                </div>
              </div>

              {/* Amount + paid */}
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className={lbl}>Montant (€)</label>
                  <input type="number" min="0" value={f.amount}
                    onChange={e => set('amount', Number(e.target.value))} className={inp} />
                </div>
                <div className="flex items-center gap-2 pb-1.5">
                  <button onClick={() => set('paid', !f.paid)}
                    className={`w-11 h-6 rounded-full relative transition-all ${f.paid ? 'bg-green-500' : 'bg-gray-700'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${f.paid ? 'left-6' : 'left-1'}`} />
                  </button>
                  <span className={`text-sm font-bold ${f.paid ? 'text-green-400' : 'text-gray-500'}`}>
                    {f.paid ? 'Payé' : 'Non payé'}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={lbl}>Notes</label>
                <textarea value={f.notes} onChange={e => set('notes', e.target.value)}
                  rows={2} placeholder="Infos complémentaires..."
                  className={`${inp} resize-none`} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={lbl}>Type</label>
                <select value={f.breakLabel} onChange={e => set('breakLabel', e.target.value)} className={inp}>
                  {['Pause déjeuner', 'Pause', 'Jour férié', 'Fermé', 'Formation'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={lbl}>Date *</label>
                  <input type="date" value={f.date} onChange={e => set('date', e.target.value)} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Début</label>
                  <input type="time" value={f.start} onChange={e => set('start', e.target.value)} step="300" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Fin</label>
                  <input type="time" value={f.end} onChange={e => set('end', e.target.value)} step="300" className={inp} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          {isEdit && onDelete && (
            <button onClick={() => { onDelete(); onClose() }}
              className="px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5">
              <Trash2 size={13} /> Suppr.
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 py-3 border border-white/10 text-gray-400 font-bold text-sm rounded-xl hover:border-white/20 transition-all">
            Annuler
          </button>
          <button onClick={save} disabled={!valid}
            className="flex-1 py-3 bg-gold text-black font-black text-sm rounded-xl uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center gap-2">
            <Check size={15} /> {isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function AppointmentsPage() {
  const TODAY   = new Date()
  const [current, setCurrent] = useState(new Date())
  const [view,    setView]    = useState('week')
  const [events,  setEvents]  = useState([])
  const [modal,   setModal]   = useState(null)

  useEffect(() => subscribeAppointments(setEvents), [])

  // ── Dates range ────────────────────────────────────────────────────────────
  const dates = view === 'day'
    ? [new Date(current)]
    : view === '3days'
      ? Array.from({ length: 3 }, (_, i) => { const d = new Date(current); d.setDate(d.getDate() + i); return d })
      : getWeekDates(current)

  const step = view === 'day' ? 1 : view === '3days' ? 3 : 7
  const nav  = dir => { const d = new Date(current); d.setDate(d.getDate() + dir * step); setCurrent(d) }

  const dateLabel = () => {
    if (view === 'day') return dates[0].toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const a = dates[0], b = dates[dates.length - 1]
    return `${a.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} – ${b.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const dayEvs  = d => events.filter(e => e.date === isoDate(d))
  const addEv   = ev => addAppointmentFS(ev).catch(console.error)
  const editEv  = ev => updateAppointmentFS(ev.id, ev).catch(console.error)
  const delEv   = id => deleteAppointmentFS(id).catch(console.error)

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = (defaults = {}) => setModal({
    mode: 'add',
    data: { ...BLANK, date: isoDate(dates[0]), ...defaults },
  })
  const openEdit = ev => {
    setModal({
      mode: 'edit',
      data: {
        ...BLANK,
        id: ev.id,
        type: ev.type,
        clientName: ev.clientName || '',
        svcId: ev.svcId || SERVICES[0]?.id,
        barberId: ev.barberId || BARBERS[0]?.id,
        date: ev.date,
        start: ev.start,
        end: ev.end,
        amount: ev.amount || 0,
        paid: ev.paid || false,
        notes: ev.notes || '',
        breakLabel: ev.label || 'Pause déjeuner',
      },
    })
  }

  const onSave = form => {
    const base = { date: form.date, start: form.start, end: form.end }
    const ev   = form.type === 'break'
      ? { ...base, type: 'break', label: form.breakLabel }
      : { ...base, type: 'appointment', clientName: form.clientName, svcId: form.svcId, service: SERVICES.find(s => s.id === form.svcId)?.name || '', barberId: form.barberId, amount: form.amount, paid: form.paid, notes: form.notes }
    if (modal.mode === 'add') addEv(ev)
    else editEv({ ...ev, id: form.id })
  }

  // ── Grid click → open add modal at clicked time ───────────────────────────
  const onGridClick = (date, y) => {
    const raw  = DAY_START * 60 + (y / HOUR_H) * 60
    const snap = Math.floor(raw / 15) * 15
    const h    = Math.floor(snap / 60), m = snap % 60
    const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    openAdd({ date: isoDate(date), start, end: addMins(start, 30) })
  }

  // ── Calendar grid ─────────────────────────────────────────────────────────
  const CalGrid = () => (
    <div className="flex overflow-x-auto select-none">
      {/* Time gutter */}
      <div className="w-14 shrink-0 bg-[#0A0A0A] border-r border-white/5 z-10" style={{ paddingTop: 48 }}>
        {HOUR_LABELS.map((t, i) => (
          <div key={t} style={{ height: HOUR_H }} className="relative">
            <span className="absolute -top-2.5 right-2 text-[10px] text-gray-600 tabular-nums">{t}</span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="flex flex-1">
        {dates.map((date, di) => {
          const isToday = isoDate(date) === isoDate(TODAY)
          const laid    = layoutDay(dayEvs(date))

          return (
            <div key={di}
              className={`flex-1 min-w-[130px] flex flex-col border-r border-white/5 ${isToday ? 'bg-gold/5' : ''}`}
              style={{ minWidth: view === 'day' ? '100%' : undefined }}>

              {/* Day header */}
              <div className={`h-12 flex flex-col items-center justify-center border-b border-white/5 shrink-0 ${isToday ? 'bg-gold/10' : 'bg-[#0A0A0A]'}`}>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </span>
                <span className={`text-base font-black leading-none mt-0.5 ${isToday ? 'text-gold' : 'text-white'}`}>
                  {date.getDate()}
                </span>
              </div>

              {/* Events area */}
              <div
                className="relative"
                style={{ height: GRID_H, cursor: 'crosshair' }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  onGridClick(date, e.clientY - rect.top)
                }}
              >
                {/* Hour lines */}
                {HOUR_LABELS.map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 border-t border-white/5" style={{ top: i * HOUR_H }} />
                ))}
                {/* Half-hour lines */}
                {HOUR_LABELS.map((_, i) => (
                  <div key={`h${i}`} className="absolute left-0 right-0 border-t border-white/5"
                    style={{ top: i * HOUR_H + HOUR_H / 2, opacity: 0.4 }} />
                ))}

                {/* Current time indicator */}
                {isToday && (() => {
                  const now = new Date()
                  const top = ((now.getHours() * 60 + now.getMinutes() - DAY_START * 60) / 60) * HOUR_H
                  return (top > 0 && top < GRID_H) ? (
                    <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top }}>
                      <div className="h-0.5 bg-red-500 w-full relative">
                        <div className="absolute -left-0.5 -top-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                      </div>
                    </div>
                  ) : null
                })()}

                {/* Events */}
                {laid.map(ev => {
                  const top    = ((toMins(ev.start) - DAY_START * 60) / 60) * HOUR_H
                  const height = Math.max(((toMins(ev.end) - toMins(ev.start)) / 60) * HOUR_H, HOUR_H * 0.35)
                  const pxW    = `${100 / ev._n}%`
                  const pxL    = `${(ev._c / ev._n) * 100}%`

                  if (ev.type === 'break') {
                    return (
                      <div key={ev.id} style={{ top, height, width: pxW, left: pxL }}
                        className="absolute px-0.5 py-0.5 z-10"
                        onClick={e => { e.stopPropagation(); openEdit(ev) }}>
                        <div className="h-full bg-[#1c1c1c] border border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-white/20 transition-all overflow-hidden">
                          <span className="text-gray-500 text-[9px] font-bold uppercase tracking-wider text-center px-1 leading-tight">{ev.label}</span>
                        </div>
                      </div>
                    )
                  }

                  const clr = B_CLR[ev.barberId] || DEF_CLR
                  return (
                    <div key={ev.id} style={{ top, height, width: pxW, left: pxL }}
                      className="absolute px-0.5 py-0.5 z-10"
                      onClick={e => { e.stopPropagation(); openEdit(ev) }}>
                      <div className="h-full rounded-lg px-2 py-1 overflow-hidden cursor-pointer transition-all hover:brightness-110"
                        style={{ background: clr.bg, borderLeft: `3px solid ${clr.border}` }}>
                        <div className="flex items-center gap-0.5">
                          {ev.paid && <span className="text-green-300 text-[9px] font-black">€</span>}
                          <span className="text-white/80 text-[9px] font-bold tabular-nums">{ev.start}</span>
                        </div>
                        <p className="text-white text-[11px] font-black truncate leading-tight">{ev.clientName}</p>
                        {height > HOUR_H * 0.5 && (
                          <p className="text-white/70 text-[9px] truncate leading-tight mt-0.5">{ev.service}</p>
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
  )

  // ── List view ──────────────────────────────────────────────────────────────
  const ListBody = () => {
    const all = [...events].sort((a, b) => a.date.localeCompare(b.date) || toMins(a.start) - toMins(b.start))
    if (all.length === 0) return (
      <div className="text-center py-20 text-gray-600">
        <CalIcon size={48} className="mx-auto mb-4 opacity-20" />
        <p className="text-sm mb-4">Aucun rendez-vous enregistré</p>
        <button onClick={() => openAdd()}
          className="px-6 py-3 bg-gold/10 border border-gold/30 text-gold text-sm font-bold rounded-xl hover:bg-gold/20 transition-colors">
          + Ajouter le premier RDV
        </button>
      </div>
    )

    let lastDate = null
    return (
      <div className="space-y-1">
        {all.map(ev => {
          const showDate = ev.date !== lastDate
          lastDate = ev.date
          const barber = BARBERS.find(b => b.id === ev.barberId)
          const clr    = B_CLR[ev.barberId] || DEF_CLR
          return (
            <div key={ev.id}>
              {showDate && (
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 pt-4 pb-1 px-1">
                  {new Date(ev.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              )}
              <div onClick={() => openEdit(ev)}
                className="flex items-center gap-4 bg-[#0D0D0D] border border-white/5 rounded-xl px-5 py-3 cursor-pointer hover:border-white/10 transition-all">
                <div className="w-1 h-10 rounded-full shrink-0"
                  style={{ background: ev.type === 'break' ? '#374151' : clr.dot }} />
                <div className="w-14 shrink-0">
                  <p className="text-gold font-black text-sm">{ev.start}</p>
                  <p className="text-gray-600 text-[10px]">{ev.end}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">
                    {ev.type === 'break' ? ev.label : ev.clientName}
                  </p>
                  {ev.type === 'appointment' && (
                    <p className="text-gray-400 text-xs truncate">
                      {ev.service}{barber ? ` • ${barber.firstName}` : ''}
                    </p>
                  )}
                </div>
                {ev.type === 'appointment' && (
                  <div className="text-right shrink-0">
                    <p className="text-gold font-black text-sm">{ev.amount}€</p>
                    <p className={`text-[10px] font-bold ${ev.paid ? 'text-green-400' : 'text-gray-600'}`}>
                      {ev.paid ? '✓ Payé' : 'Non payé'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Summary stats bar ─────────────────────────────────────────────────────
  const periodEvs    = events.filter(e => dates.some(d => isoDate(d) === e.date) && e.type === 'appointment')
  const periodCA     = periodEvs.reduce((s, e) => s + (e.amount || 0), 0)
  const periodPaid   = periodEvs.filter(e => e.paid).reduce((s, e) => s + (e.amount || 0), 0)

  return (
    <div className="flex flex-col bg-black" style={{ minHeight: '100%' }}>

      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 px-4 py-3 border-b border-white/10 bg-[#0A0A0A] flex-wrap shrink-0">

        {/* View switcher */}
        <div className="flex bg-black rounded-xl p-1 border border-white/10 shrink-0">
          {[['day', 'Jour'], ['3days', '3 jours'], ['week', 'Semaine'], ['list', 'Liste']].map(([k, l]) => (
            <button key={k} onClick={() => setView(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                view === k ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
              }`}>{l}</button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => nav(-1)}
            className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => setCurrent(new Date())}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-white/10 rounded-xl text-gray-300 hover:text-white hover:border-gold/40 transition-all">
            Auj.
          </button>
          <button onClick={() => nav(1)}
            className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Date label */}
        <p className="text-white font-bold text-sm flex-1 min-w-0 truncate capitalize hidden sm:block">{dateLabel()}</p>

        {/* Stats quick view */}
        {view !== 'list' && periodEvs.length > 0 && (
          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="text-gray-500">{periodEvs.length} RDV</span>
            <span className="text-gold font-bold">{periodCA}€ CA</span>
            <span className="text-green-400 font-bold">{periodPaid}€ encaissé</span>
          </div>
        )}

        {/* Add */}
        <button onClick={() => openAdd()}
          className="flex items-center gap-1.5 bg-gold text-black font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shrink-0">
          <Plus size={14} /> Nouveau RDV
        </button>
      </div>

      {/* ── Content ── */}
      {view === 'list' ? (
        <div className="flex-1 p-4 max-w-3xl mx-auto w-full"><ListBody /></div>
      ) : (
        <CalGrid />
      )}

      {/* ── Legend ── */}
      {view !== 'list' && (
        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 bg-[#0A0A0A] flex-wrap shrink-0">
          {BARBERS.map(b => (
            <div key={b.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: B_CLR[b.id]?.dot || '#3B82F6' }} />
              <span className="text-xs text-gray-500">{b.firstName} {b.lastName}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
            <span className="text-xs text-gray-500">Pause / Fermé</span>
          </div>
          <span className="text-[10px] text-gray-700 ml-auto hidden md:block">
            Cliquer sur la grille pour ajouter un RDV
          </span>
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <EventModal
          init={modal.data}
          isEdit={modal.mode === 'edit'}
          onSave={onSave}
          onDelete={modal.mode === 'edit' ? () => delEv(modal.data.id) : null}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
