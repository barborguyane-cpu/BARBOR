import { useState } from 'react'
import { Shield, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { getAdminCredentials, updateAdminCredentials } from '../../data/adminAuth.js'

function Field({ label, value, onChange, type = 'text', placeholder }) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input
          type={isPass && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                     placeholder-gray-700 focus:outline-none focus:border-gold/40 transition-colors pr-10"
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

export function SettingsPage() {
  const current = getAdminCredentials()

  const [email,    setEmail]    = useState(current.email)
  const [oldPwd,   setOldPwd]   = useState('')
  const [newPwd,   setNewPwd]   = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  const save = (e) => {
    e.preventDefault()
    setError(''); setSuccess(false)

    const creds = getAdminCredentials()
    if (oldPwd !== creds.password) { setError('Mot de passe actuel incorrect.'); return }
    if (newPwd.length < 6)         { setError('Le nouveau mot de passe doit faire au moins 6 caractères.'); return }
    if (newPwd !== confirm)        { setError('Les deux mots de passe ne correspondent pas.'); return }

    updateAdminCredentials({ email, password: newPwd })
    setOldPwd(''); setNewPwd(''); setConfirm('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="p-5 max-w-md mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield size={20} className="text-gold" /> Sécurité & Accès
        </h1>
        <p className="text-gray-500 text-sm mt-1">Modifier les identifiants administrateur</p>
      </div>

      <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">Identifiants actuels</p>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black border border-white/5">
          <Shield size={14} className="text-gold shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-white text-sm font-bold">{current.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={save} className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5 space-y-4">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Modifier les identifiants</p>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-sm">
            <Check size={14} /> Identifiants mis à jour avec succès !
          </div>
        )}

        <Field label="Nouvel email" value={email} onChange={setEmail} placeholder="admin@barbor.gf" />
        <Field label="Mot de passe actuel" value={oldPwd} onChange={setOldPwd} type="password" placeholder="••••••••" />
        <Field label="Nouveau mot de passe" value={newPwd} onChange={setNewPwd} type="password" placeholder="Min. 6 caractères" />
        <Field label="Confirmer le mot de passe" value={confirm} onChange={setConfirm} type="password" placeholder="••••••••" />

        <button type="submit"
          className="w-full py-3 rounded-xl bg-gold text-black font-black uppercase tracking-widest text-sm
                     hover:opacity-90 active:scale-95 transition-all mt-2">
          Enregistrer
        </button>
      </form>
    </div>
  )
}
