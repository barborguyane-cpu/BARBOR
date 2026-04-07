import { useState } from 'react'
import { X, LogIn } from 'lucide-react'
import { Logo } from './Logo.jsx'

export function LoginModal({ onLogin, onClose }) {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    onLogin('client')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0D1B2A] border border-gold/30 rounded-3xl p-6 space-y-5 shadow-2xl shadow-gold/10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} variant="gold" />
            <div>
              <p className="text-gold font-black tracking-[4px] text-sm">BARB'OR</p>
              <p className="text-gray-500 text-[10px] tracking-widest">GUYANE</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <div className="text-center space-y-1 py-2">
          <LogIn size={32} className="text-gold mx-auto" />
          <h2 className="text-xl font-black text-white">Connexion client</h2>
          <p className="text-gray-400 text-sm">Connectez-vous pour réserver ou acheter</p>
        </div>

        {/* Simulated credentials */}
        <div className="bg-black/30 rounded-xl p-3 text-xs text-gray-500 space-y-0.5">
          <p>✉️ demo@barbor.gf &nbsp; 🔑 demo1234</p>
        </div>

        {/* Actions */}
        <button onClick={handleLogin} disabled={loading}
          className="btn-gold w-full flex items-center justify-center gap-2">
          {loading
            ? <span className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
            : <><LogIn size={16} /> Se connecter</>
          }
        </button>

        <p className="text-center text-gray-500 text-xs">
          Pas encore de compte ?{' '}
          <span className="text-gold font-bold cursor-pointer hover:underline">Créer un compte</span>
        </p>
      </div>
    </div>
  )
}
