import { useState } from 'react'
import { Logo } from '../components/common/Logo.jsx'

export function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [role, setRole]         = useState('client')

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    onLogin(role)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-gradient flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold/3 blur-2xl pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-10 gap-4">
          <Logo size={100} variant="gold" />
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-[8px] gradient-text">BARB'OR</h1>
            <p className="text-gray-400 tracking-[10px] text-sm font-light">GUYANE</p>
          </div>
          <div className="h-px w-24 bg-gold/50" />
          <p className="text-gray-500 text-xs tracking-[3px] uppercase">L'excellence au service de votre style</p>
        </div>

        {/* Role selector */}
        <div className="flex bg-surface rounded-xl p-1 mb-6 border border-white/5">
          {['client', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                role === r ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {r === 'client' ? '👤 Client' : '⚙️ Admin'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handle} className="card-gold flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Connexion</h2>
            <p className="text-gray-500 text-sm">Accédez à votre espace {role === 'admin' ? 'gérant' : 'premium'}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@barbor.fr' : 'jean@email.fr'}
              className="bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600
                         focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-widest">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600
                         focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <button type="submit" disabled={loading}
            className="btn-gold w-full mt-2 flex items-center justify-center gap-2">
            {loading
              ? <span className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
              : `Se connecter${role === 'admin' ? ' — Admin' : ''}`
            }
          </button>

          <p className="text-center text-gray-500 text-sm">
            Pas encore membre ?{' '}
            <span className="text-gold cursor-pointer hover:underline">Créer un compte</span>
          </p>
        </form>

        <p className="text-center text-gray-600 text-xs mt-8 tracking-widest">✦ PREMIUM BARBERSHOP ✦</p>
      </div>
    </div>
  )
}
