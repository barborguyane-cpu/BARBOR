import { useState } from 'react'
import { Check, Star, Clock, ChevronRight, CreditCard } from 'lucide-react'
import { BARBERS, SERVICES, HOURS } from '../../data/mockData.js'
import { addAppointmentFS } from '../../data/firestoreData.js'

const STEPS = ['Barber', 'Service', 'Date & Heure', 'Paiement']
const TIMES = HOURS.slots
const BUSY  = [] // aucun créneau fictif bloqué

// Génère les 14 prochains jours ouvrables (Mar–Sam)
function genDates() {
  const dates = []
  const d = new Date()
  while (dates.length < 14) {
    d.setDate(d.getDate() + 1)
    if (HOURS.openDays.includes(d.getDay())) dates.push(new Date(d))
  }
  return dates
}

// Filtre les services réservables (pas "sur devis")
const BOOKABLE_SERVICES = SERVICES.filter(s => !s.devis)

export function BookingPage({ auth, onRequireAuth }) {
  const [step, setStep]         = useState(0)
  const [barber, setBarber]     = useState(null)
  const [service, setService]   = useState(null)
  const [date, setDate]         = useState(null)
  const [time, setTime]         = useState(null)
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const deposit = service ? Math.round(service.price * 0.3) : 0

  const goToPayment = () => {
    onRequireAuth?.(() => setStep(3)) || setStep(3)
  }

  const confirm = async () => {
    if (!auth?.loggedIn) { onRequireAuth?.(); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    // Calcul de l'heure de fin
    const addMins = (t, n) => {
      const [h, m] = t.split(':').map(Number)
      const tot = h * 60 + m + n
      return `${String(~~(tot / 60)).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`
    }
    const toIso = d => {
      const y = d.getFullYear(), mo = String(d.getMonth() + 1).padStart(2, '0'), da = String(d.getDate()).padStart(2, '0')
      return `${y}-${mo}-${da}`
    }

    const ev = {
      id:         `booking_${Date.now()}`,
      type:       'appointment',
      clientName: auth.user ? `${auth.user.firstName} ${auth.user.lastName}`.toUpperCase() : 'CLIENT',
      userId:     auth.user?.id || null,
      phone:      auth.user?.phone || '',
      svcId:      service.id,
      service:    service.name,
      barberId:   barber.id,
      date:       toIso(date),
      start:      time,
      end:        addMins(time, service.duration),
      amount:     service.price,
      paid:       true,
      notes:      `Acompte ${deposit}€ payé en ligne`,
    }

    // Sauvegarde Firestore (partagée entre tous les appareils)
    addAppointmentFS(ev).catch(console.error)

    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 gap-6">
      <div className="w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center animate-bounce">
        <Check size={48} className="text-black font-black" strokeWidth={3} />
      </div>
      <h2 className="text-2xl font-black text-white text-center">Réservation confirmée !</h2>
      <div className="card-gold w-full max-w-sm space-y-3">
        <p className="text-gold font-bold text-sm uppercase tracking-widest">Récapitulatif</p>
        {[
          ['Barber',    `${barber?.firstName} ${barber?.lastName}`],
          ['Prestation', service?.name],
          ['Date',      date?.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })],
          ['Heure',     time],
          ['Acompte payé', `${deposit}€ ✅`],
        ].map(([k,v]) => (
          <div key={k} className="flex justify-between text-sm">
            <span className="text-gray-400">{k}</span>
            <span className="text-white font-semibold capitalize">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={() => { setSuccess(false); setStep(0); setBarber(null); setService(null); setDate(null); setTime(null) }}
        className="btn-outline text-sm">Nouvelle réservation</button>
    </div>
  )

  return (
    <div className="px-4 py-6 pb-8">
      <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-1">Réservation</h1>
      <p className="text-gray-500 text-sm mb-6">Réservez votre créneau premium</p>

      {/* Steps */}
      <div className="flex items-center mb-8 gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                i < step ? 'bg-gold text-black' :
                i === step ? 'bg-gold text-black ring-2 ring-gold/40' :
                'bg-surface text-gray-500 border border-white/10'
              }`}>
                {i < step ? <Check size={12} strokeWidth={3}/> : i + 1}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wide ${i <= step ? 'text-gold' : 'text-gray-600'}`}>
                {s.split(' ')[0]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-1 mb-4 transition-all ${i < step ? 'bg-gold' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Barber */}
      {step === 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white mb-4">Choisissez votre barber</h2>
          {BARBERS.map(b => (
            <button key={b.id} disabled={!b.available}
              onClick={() => { setBarber(b); setStep(1) }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left
                ${barber?.id === b.id ? 'border-gold bg-gold/5' : 'border-white/10 bg-surface hover:border-gold/40'}
                ${!b.available ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}>
              <div className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center shrink-0">
                <span className="text-gold font-black text-lg">{b.avatar}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">{b.firstName} {b.lastName}</p>
                <p className="text-gray-400 text-sm">{b.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-gold fill-gold" />
                  <span className="text-gold text-xs font-bold">{b.rating}</span>
                  <span className="text-gray-500 text-xs">({b.reviews} avis)</span>
                </div>
              </div>
              {b.available
                ? <span className="badge-green">Dispo</span>
                : <span className="badge-red">Indispo</span>
              }
            </button>
          ))}
        </div>
      )}

      {/* Step 1 — Service */}
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white mb-4">Choisissez votre prestation</h2>
          {BOOKABLE_SERVICES.map(s => (
            <button key={s.id} onClick={() => { setService(s); setStep(2) }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left
                hover:scale-[1.01] active:scale-[0.99]
                ${service?.id === s.id ? 'border-gold bg-gold/5' : 'border-white/10 bg-surface hover:border-gold/40'}`}>
              <div className="flex-1">
                <p className="font-bold text-white">{s.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Clock size={12} className="text-gray-500" />
                  <span className="text-gray-500 text-xs">{s.duration} min</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-gold">{s.price}€</p>
                <p className="text-gray-500 text-xs">acompte {Math.round(s.price * 0.3)}€</p>
              </div>
            </button>
          ))}
          <button onClick={() => setStep(0)} className="text-gray-500 text-sm hover:text-gold transition-colors">← Retour</button>
        </div>
      )}

      {/* Step 2 — Date & Time */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Choisissez votre créneau</h2>
          {/* Dates */}
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Date</p>
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
            {genDates().map((d, i) => (
              <button key={i} onClick={() => setDate(d)}
                className={`shrink-0 w-14 h-20 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all
                  ${date?.toDateString() === d.toDateString()
                    ? 'bg-gold border-gold'
                    : 'bg-surface border-white/10 hover:border-gold/40'}`}>
                <span className={`text-xs font-bold uppercase ${date?.toDateString() === d.toDateString() ? 'text-black' : 'text-gray-400'}`}>
                  {d.toLocaleDateString('fr-FR',{weekday:'short'}).slice(0,3)}
                </span>
                <span className={`text-xl font-black ${date?.toDateString() === d.toDateString() ? 'text-black' : 'text-white'}`}>
                  {d.getDate()}
                </span>
                <span className={`text-xs font-bold uppercase ${date?.toDateString() === d.toDateString() ? 'text-black' : 'text-gray-500'}`}>
                  {d.toLocaleDateString('fr-FR',{month:'short'}).slice(0,3)}
                </span>
              </button>
            ))}
          </div>

          {/* Time slots */}
          {date && (
            <>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-5 mb-3">Heure</p>
              <div className="grid grid-cols-4 gap-2">
                {TIMES.map(t => {
                  const busy = BUSY.includes(t)
                  return (
                    <button key={t} disabled={busy} onClick={() => setTime(t)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all
                        ${time === t ? 'bg-gold/15 border-gold text-gold' :
                          busy ? 'bg-surface border-white/5 text-gray-600 cursor-not-allowed' :
                          'bg-surface border-white/10 text-white hover:border-gold/40'}`}>
                      {t}
                      {busy && <span className="block text-[9px] text-red-400">Occupé</span>}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn-outline flex-1 text-sm">← Retour</button>
            {date && time && (
              <button onClick={goToPayment} className="btn-gold flex-1 text-sm">Continuer →</button>
            )}
          </div>
        </div>
      )}

      {/* Step 3 — Confirm & Pay */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-4">Confirmation & Paiement</h2>

          {/* Summary */}
          <div className="card-gold space-y-3">
            <p className="text-gold text-xs uppercase tracking-widest font-bold">Récapitulatif</p>
            {[
              ['Barber',     `${barber.firstName} ${barber.lastName}`],
              ['Prestation', service.name],
              ['Date',       date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})],
              ['Heure',      time],
              ['Durée',      `${service.duration} min`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                <span className="text-gray-400">{k}</span>
                <span className="text-white font-semibold capitalize">{v}</span>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="card space-y-3">
            <p className="text-gold text-xs uppercase tracking-widest font-bold">Paiement</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Prix total</span>
              <span className="text-white font-bold">{service.price}€</span>
            </div>
            <div className="flex justify-between items-center bg-gold/10 border border-gold/30 rounded-xl px-4 py-3">
              <div>
                <p className="text-gold font-bold text-sm">Acompte à payer maintenant</p>
                <p className="text-gray-500 text-xs">30% du montant total</p>
              </div>
              <span className="text-3xl font-black text-gold">{deposit}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Reste en salon</span>
              <span className="text-gray-300 font-semibold">{service.price - deposit}€</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <span className="text-blue-400 text-xl">ℹ️</span>
            <p className="text-gray-400 text-xs leading-relaxed">
              L'acompte est obligatoire pour confirmer votre rendez-vous. Annulation gratuite jusqu'à 24h avant.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-outline flex-1 text-sm">← Retour</button>
            <button onClick={confirm} disabled={loading}
              className="btn-gold flex-1 text-sm flex items-center justify-center gap-2">
              {loading
                ? <span className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                : <><CreditCard size={16} /> Payer {deposit}€</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
