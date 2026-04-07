import { useState } from 'react'
import { Shield, Lock } from 'lucide-react'

export function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    await new Promise(r => setTimeout(r, 900))
    // In prod: validate against real credentials
    // For demo: any input works
    if (email.trim() && password.trim()) {
      onLogin('admin')
    } else {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Shield size={28} className="text-white/60" />
          </div>
          <div className="text-center">
            <h1 className="text-white font-bold text-xl tracking-widest uppercase">Espace Administrateur</h1>
            <p className="text-gray-600 text-xs mt-1 tracking-[3px] uppercase">Accès réservé au personnel</p>
          </div>
          <div className="h-px w-16 bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handle} className="space-y-4 bg-[#0D0D0D] border border-white/8 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              Identifiants incorrects.
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-widest">Identifiant</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@barbor.gf"
              autoComplete="username"
              className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                         focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-widest">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                         focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2
                       bg-white text-black font-bold uppercase tracking-widest text-sm
                       py-3.5 rounded-xl hover:bg-gray-100 active:scale-95
                       transition-all duration-200 disabled:opacity-50">
            {loading
              ? <span className="animate-spin w-4 h-4 border-2 border-black/20 border-t-black rounded-full" />
              : <><Lock size={14} /> Accéder au tableau de bord</>
            }
          </button>
        </form>

        <p className="text-center text-gray-700 text-xs mt-6 tracking-widest">
          BARB'OR GUYANE · ADMIN
        </p>
      </div>
    </div>
  )
}
