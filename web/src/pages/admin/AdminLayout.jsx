import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, Package, UserCheck,
  LogOut, Menu, X, Clock, Palmtree, BarChart2, Globe, Star
} from 'lucide-react'
import { useState } from 'react'
import { Logo } from '../../components/common/Logo.jsx'

const NAV = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',       end: true },
  { to: '/admin/appointments', icon: Calendar,        label: 'Planning & RDV'            },
  { to: '/admin/employees',    icon: Users,           label: 'Employés'                  },
  { to: '/admin/pointage',     icon: Clock,           label: 'Pointage'                  },
  { to: '/admin/conges',       icon: Palmtree,        label: 'Congés'                    },
  { to: '/admin/stats',        icon: BarChart2,       label: 'Stats Barbers'             },
  { to: '/admin/products',     icon: Package,         label: 'Produits & Stock'          },
  { to: '/admin/clients',      icon: UserCheck,       label: 'Clients'                   },
  { to: '/admin/site',         icon: Globe,           label: 'Éditeur du site'           },
  { to: '/admin/reviews',      icon: Star,            label: 'Avis clients'              },
]

function SideNav({ onClose, onLogout }) {
  return (
    <>
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <img src="/logo.png" alt="" className="w-6 h-6 object-contain"
              onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <p className="text-white font-black tracking-[3px] text-sm">BARB'OR</p>
            <p className="text-gray-600 text-[10px] tracking-widest uppercase">Administration</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {/* Section labels */}
        <p className="text-[10px] text-gray-700 uppercase tracking-[3px] px-3 pt-3 pb-1">Vue d'ensemble</p>
        {NAV.slice(0, 2).map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive ? 'bg-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon size={17} /> {label}
          </NavLink>
        ))}

        <p className="text-[10px] text-gray-700 uppercase tracking-[3px] px-3 pt-4 pb-1">Équipe</p>
        {NAV.slice(2, 6).map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive ? 'bg-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon size={17} /> {label}
          </NavLink>
        ))}

        <p className="text-[10px] text-gray-700 uppercase tracking-[3px] px-3 pt-4 pb-1">Commerce</p>
        {NAV.slice(6, 8).map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive ? 'bg-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon size={17} /> {label}
          </NavLink>
        ))}

        <p className="text-[10px] text-gray-700 uppercase tracking-[3px] px-3 pt-4 pb-1">Site web</p>
        {NAV.slice(8).map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive ? 'bg-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 w-full text-sm font-semibold transition-all">
          <LogOut size={17} /> Déconnexion
        </button>
      </div>
    </>
  )
}

export function AdminLayout({ onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0A0A0A] border-r border-white/10 shrink-0">
        <SideNav onLogout={onLogout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-[#0A0A0A] border-r border-white/10 flex flex-col">
            <SideNav onClose={() => setOpen(false)} onLogout={onLogout} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="text-white/60 hover:text-white transition-colors">
            <Menu size={22} />
          </button>
          <span className="text-white font-black tracking-[3px] text-sm">BARB'OR ADMIN</span>
          <button onClick={onLogout} className="text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
