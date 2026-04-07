import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Scissors, Calendar, ShoppingBag, Car, User, LogOut, LogIn, ArrowLeft } from 'lucide-react'
import { Logo } from '../../components/common/Logo.jsx'

const NAV = [
  { to: '/home',    icon: Scissors,    label: 'Accueil'       },
  { to: '/booking', icon: Calendar,    label: 'Réserver'      },
  { to: '/shop',    icon: ShoppingBag, label: 'Boutique'      },
  { to: '/driver',  icon: Car,         label: "BARB'DRIVER"   },
  { to: '/profile', icon: User,        label: 'Mon Profil'    },
]

export function ClientLayout({ auth, onLogout, onLogin }) {
  const isLoggedIn = auth?.loggedIn
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-navy/90 backdrop-blur border-b border-gold/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/')} className="text-gray-500 hover:text-gold transition-colors p-1">
            <ArrowLeft size={18} />
          </button>
          <Logo size={32} variant="gold" />
          <div>
            <span className="text-gold font-black tracking-[4px] text-base">BARB'OR</span>
            <span className="block text-gray-500 text-[9px] tracking-[4px]">GUYANE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-black text-black text-sm">JM</div>
              <button onClick={onLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Se déconnecter">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 border border-gold/50 text-gold text-xs font-bold px-4 py-2 rounded-xl
                         hover:bg-gold hover:text-black transition-all duration-200"
            >
              <LogIn size={14} />
              Connexion
            </button>
          )}
        </div>
      </header>

      {/* Guest banner */}
      {!isLoggedIn && (
        <div className="bg-gold/10 border-b border-gold/20 px-4 py-2 flex items-center justify-between">
          <p className="text-gold/80 text-xs font-semibold">
            👋 Bienvenue ! Connectez-vous pour réserver ou acheter.
          </p>
          <button onClick={onLogin} className="text-gold text-xs font-black hover:underline">
            Se connecter →
          </button>
        </div>
      )}

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-surface border-t border-gold/20 flex z-40">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 gap-1 text-xs font-semibold transition-colors ${
                isActive ? 'text-gold' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
