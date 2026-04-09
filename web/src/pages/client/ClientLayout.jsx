import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Home, Calendar, ShoppingBag, Car, User } from 'lucide-react'

const NAV = [
  { to: '/',        icon: Home,        label: 'Accueil',      end: true },
  { to: '/booking', icon: Calendar,    label: 'Réserver'               },
  { to: '/shop',    icon: ShoppingBag, label: 'Boutique'               },
  { to: '/driver',  icon: Car,         label: "BARB'DRIVER"            },
  { to: '/profile', icon: User,        label: 'Mon Profil'             },
]

export function ClientLayout({ auth, onLogout, onLogin }) {
  const isLoggedIn = auth?.loggedIn
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar — style premium cohérent */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/8 px-5 py-3 flex items-center justify-between">
        <button onClick={() => nav('/')} className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="" className="h-8 w-8 object-contain"
            onError={e => e.target.style.display='none'} />
          <div>
            <p className="font-display text-gold text-base tracking-[4px] leading-none">BARB'OR</p>
            <p className="text-gray-600 text-[9px] tracking-[3px] uppercase leading-none mt-0.5">Guyane</p>
          </div>
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-black text-black text-xs">
              {`${auth.user?.firstName?.[0] || ''}${auth.user?.lastName?.[0] || ''}`.toUpperCase() || 'C'}
            </div>
          </div>
        ) : (
          <button onClick={onLogin}
            className="text-xs font-bold text-gold border border-gold/40 px-4 py-2 rounded-full
              hover:bg-gold hover:text-black transition-all duration-200 tracking-wide">
            Connexion
          </button>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom nav — style premium */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/8 flex">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                isActive ? 'text-gold' : 'text-gray-600 hover:text-gray-300'
              }`
            }>
            <Icon size={19} />
            <span className="text-[9px] tracking-wide font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

