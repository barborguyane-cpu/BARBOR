import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Scissors, Calendar, ShoppingBag, Car, User, LogOut } from 'lucide-react'
import { Logo } from '../../components/common/Logo.jsx'

const NAV = [
  { to: '/',        icon: Scissors,    label: 'Accueil'       },
  { to: '/booking', icon: Calendar,    label: 'Réserver'      },
  { to: '/shop',    icon: ShoppingBag, label: 'Boutique'      },
  { to: '/driver',  icon: Car,         label: "BARB'DRIVER"   },
  { to: '/profile', icon: User,        label: 'Mon Profil'    },
]

export function ClientLayout({ onLogout }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-navy/90 backdrop-blur border-b border-gold/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={36} variant="gold" />
          <div>
            <span className="text-gold font-black tracking-[4px] text-lg">BARB'OR</span>
            <span className="block text-gray-500 text-xs tracking-[4px]">GUYANE</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-black text-black text-sm">JM</div>
          <button onClick={onLogout} className="text-gray-400 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-surface border-t border-gold/20 flex">
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
