import { useState } from 'react'
import { X, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react'
import { loginUser, registerUser } from '../../data/usersData.js'

const inp = `w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm
  placeholder:text-gray-700 focus:outline-none focus:border-gold/50 transition-colors`

function PwdField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={`${inp} pr-10`} />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export function LoginModal({ onLogin, onClose }) {
  const [tab, setTab]           = useState('login') // 'login' | 'register'
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  // Login fields
  const [lEmail, setLEmail]     = useState('')
  const [lPwd,   setLPwd]       = useState('')

  // Register fields
  const [rFirst, setRFirst]     = useState('')
  const [rLast,  setRLast]      = useState('')
  const [rEmail, setREmail]     = useState('')
  const [rPhone, setRPhone]     = useState('')
  const [rPwd,   setRPwd]       = useState('')
  const [rPwd2,  setRPwd2]      = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const res = loginUser({ email: lEmail, password: lPwd })
    setLoading(false)
    if (res.error) return setError(res.error)
    onLogin('client', res.user)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (rPwd !== rPwd2) return setError('Les mots de passe ne correspondent pas.')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const res = registerUser({ firstName: rFirst, lastName: rLast, email: rEmail, phone: rPhone, password: rPwd })
    setLoading(false)
    if (res.error) return setError(res.error)
    onLogin('client', res.user)
  }

  const switchTab = (t) => { setTab(t); setError('') }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-sm bg-[#0D0D0D] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <p className="font-display text-gold tracking-[4px] text-base">BARB'OR</p>
            <p className="text-gray-600 text-[10px] tracking-[3px] uppercase">Guyane</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8 px-6">
          <button onClick={() => switchTab('login')}
            className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${
              tab === 'login' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <LogIn size={14} className="inline mr-1.5" />
            Connexion
          </button>
          <button onClick={() => switchTab('register')}
            className={`flex-1 pb-3 text-sm font-bold tracking-wide transition-colors ${
              tab === 'register' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <UserPlus size={14} className="inline mr-1.5" />
            Créer un compte
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Email</label>
                <input type="email" value={lEmail} onChange={e => setLEmail(e.target.value)}
                  placeholder="votre@email.com" className={inp} autoComplete="email" />
              </div>
              <PwdField label="Mot de passe" value={lPwd} onChange={setLPwd} placeholder="••••••••" />

              <button type="submit" disabled={loading}
                className="btn-gold w-full py-4 flex items-center justify-center gap-2 font-bold tracking-wide mt-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <><LogIn size={16} /> Se connecter</>
                }
              </button>

              <p className="text-center text-gray-600 text-xs pt-1">
                Pas encore de compte ?{' '}
                <button type="button" onClick={() => switchTab('register')}
                  className="text-gold font-bold hover:underline">
                  S'inscrire
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Prénom</label>
                  <input value={rFirst} onChange={e => setRFirst(e.target.value)}
                    placeholder="Jean" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Nom</label>
                  <input value={rLast} onChange={e => setRLast(e.target.value)}
                    placeholder="Martin" className={inp} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Téléphone</label>
                <input type="tel" value={rPhone} onChange={e => setRPhone(e.target.value)}
                  placeholder="0694 XX XX XX" className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">Email</label>
                <input type="email" value={rEmail} onChange={e => setREmail(e.target.value)}
                  placeholder="votre@email.com" className={inp} autoComplete="email" />
              </div>
              <PwdField label="Mot de passe (6 car. min.)" value={rPwd} onChange={setRPwd} placeholder="••••••••" />
              <PwdField label="Confirmer le mot de passe" value={rPwd2} onChange={setRPwd2} placeholder="••••••••" />

              <button type="submit" disabled={loading}
                className="btn-gold w-full py-4 flex items-center justify-center gap-2 font-bold tracking-wide mt-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <><UserPlus size={16} /> Créer mon compte</>
                }
              </button>

              <p className="text-center text-gray-600 text-xs pt-1">
                Déjà un compte ?{' '}
                <button type="button" onClick={() => switchTab('login')}
                  className="text-gold font-bold hover:underline">
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
