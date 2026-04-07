import { useState } from 'react'
import { MapPin, Clock, Car, Check, CreditCard } from 'lucide-react'
import { SERVICES } from '../../data/mockData.js'

const DRIVER_SERVICES = SERVICES.filter(s => ['coupe','pack','barbe'].includes(s.category))
const BASE_FEE = 10, PER_KM = 1.5

export function DriverPage({ auth, onRequireAuth }) {
  const [address, setAddress]     = useState('')
  const [service, setService]     = useState(null)
  const [step, setStep]           = useState(0) // 0=form 1=confirm 2=success
  const [loading, setLoading]     = useState(false)
  const estimatedKm = 4.2
  const travelFee   = BASE_FEE + estimatedKm * PER_KM
  const total       = service ? service.price + travelFee : travelFee
  const deposit     = Math.round(total * 0.3)

  const confirm = async () => {
    if (!auth?.loggedIn) { onRequireAuth?.(); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep(2)
  }

  if (step === 2) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 gap-6">
      <div className="w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center">
        <Car size={44} className="text-black" />
      </div>
      <h2 className="text-2xl font-black text-center">BARB'DRIVER confirmé !</h2>
      <div className="card-gold w-full max-w-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gold/10 rounded-xl">
            <p className="text-2xl font-black text-white">~35 min</p>
            <p className="text-gray-400 text-xs">Temps d'arrivée</p>
          </div>
          <div className="text-center p-3 bg-gold/10 rounded-xl">
            <p className="text-xl font-black text-gold">Marcus D.</p>
            <p className="text-gray-400 text-xs">Votre barber</p>
          </div>
        </div>
        <div className="space-y-2">
          {['✅ Demande reçue', '✅ Acompte confirmé', '🚗 Barber en route...', '⏳ Arrivée chez vous'].map((s, i) => (
            <div key={i} className={`flex items-center gap-3 text-sm font-semibold ${i <= 2 ? 'text-white' : 'text-gray-500'}`}>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => { setStep(0); setAddress(''); setService(null) }} className="btn-outline text-sm">
        Nouvelle demande
      </button>
    </div>
  )

  return (
    <div className="px-4 py-6 pb-8 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-black rounded-2xl p-6 border border-gold/20 space-y-4">
        <div className="inline-flex items-center gap-2 bg-gold rounded-full px-3 py-1">
          <Car size={14} className="text-black" />
          <span className="text-black text-xs font-black uppercase tracking-wider">Service Premium</span>
        </div>
        <h1 className="text-3xl font-black">
          Votre barber<br/>
          <span className="gradient-text">se déplace chez vous</span>
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Dans un rayon de 20 km autour de Cayenne. Frais calculés automatiquement.
        </p>
        <div className="grid grid-cols-3 gap-3 bg-gold/10 rounded-xl p-3 border border-gold/20">
          {[
            { icon: '📍', label: 'Zone', value: '20 km' },
            { icon: '💶', label: 'Départ', value: `${BASE_FEE}€` },
            { icon: '⏱', label: 'Arrivée', value: '~30 min' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-white font-black text-base mt-1">{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {step === 0 && (
        <>
          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <MapPin size={12} className="text-gold" /> Votre adresse
            </label>
            <textarea
              rows={3}
              placeholder="12 rue de la Liberté, Cayenne, 97300..."
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white
                         placeholder-gray-600 resize-none focus:outline-none focus:border-gold transition-colors"
            />
            {address.length > 0 && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                <MapPin size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-semibold flex-1">Distance estimée : ~{estimatedKm} km</span>
                <span className="text-gold font-black">{travelFee.toFixed(2)}€</span>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
              ✂️ Prestation
            </label>
            {DRIVER_SERVICES.map(s => (
              <button key={s.id} onClick={() => setService(s)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  service?.id === s.id ? 'border-gold bg-gold/5' : 'border-white/10 bg-surface hover:border-gold/30'
                }`}>
                <div>
                  <p className={`font-bold ${service?.id === s.id ? 'text-gold' : 'text-white'}`}>{s.name}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {s.duration} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gold">{s.price}€</p>
                  <p className="text-gray-500 text-xs">+ déplacement</p>
                </div>
              </button>
            ))}
          </div>

          {/* Recap */}
          {service && address && (
            <div className="card-gold space-y-3">
              <p className="text-gold text-xs uppercase tracking-widest font-bold">Récapitulatif</p>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Prestation</span><span>{service.price}€</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Déplacement ({estimatedKm} km)</span><span>{travelFee.toFixed(2)}€</span></div>
              <div className="flex justify-between font-bold border-t border-gold/20 pt-3">
                <span>Total</span><span className="text-2xl text-gold">{total.toFixed(2)}€</span>
              </div>
              <div className="flex items-center gap-2 bg-gold/10 rounded-xl px-3 py-2">
                <CreditCard size={14} className="text-gold" />
                <span className="text-gold text-sm font-bold">Acompte requis : {deposit}€ (30%)</span>
              </div>
            </div>
          )}

          <button onClick={() => setStep(1)} disabled={!address || !service}
            className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed">
            Confirmer la demande →
          </button>
        </>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black">Paiement de l'acompte</h2>
          <div className="card space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Total</span><span>{total.toFixed(2)}€</span></div>
            <div className="flex justify-between text-sm font-bold bg-gold/10 rounded-xl p-3 border border-gold/30">
              <span className="text-gold">Acompte maintenant</span>
              <span className="text-2xl text-gold">{deposit}€</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-outline flex-1 text-sm">← Retour</button>
            <button onClick={confirm} disabled={loading}
              className="btn-gold flex-1 text-sm flex items-center justify-center gap-2">
              {loading
                ? <span className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                : <><CreditCard size={16}/> Payer {deposit}€</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
