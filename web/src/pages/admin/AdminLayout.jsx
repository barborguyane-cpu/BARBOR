import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, Package, UserCheck, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { Logo } from '../../components/common/Logo.jsx'

const NAV = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',      end: true },
  { to: '/admin/appointments', icon: Calendar,        label: 'Planning & RDV'       },
  { to: '/admin/employees',    icon: Users,           label: 'Employés'             },
  { to: '/admin/products',     icon: Package,         label: 'Produits & Stock'     },
  { to: '/admin/clients',      icon: UserCheck,       label: 'Clients'              },
]

export function AdminLayout({ onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy border-r border-gold/15 shrink-0">
        <div className="p-6 border-b border-gold/15 flex items-center gap-3">
          <Logo size={40} variant="gold" />
          <div>
            <p className="text-gold font-black tracking-[3px] text-sm">BARB'OR</p>
            <p className="text-gray-500 text-xs tracking-widest">ADMIN</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-gold text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gold/15">
          <button onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full text-sm font-semibold transition-all">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-navy border-r border-gold/15 flex flex-col">
            <div className="p-6 border-b border-gold/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo size={36} variant="gold" />
                <div>
                  <p className="text-gold font-black tracking-[3px] text-sm">BARB'OR</p>
                  <p className="text-gray-500 text-xs tracking-widest">ADMIN</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {NAV.map(({ to, icon: Icon, label, end }) => (
                <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isActive ? 'bg-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }>
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4">
              <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full text-sm font-semibold">
                <LogOut size={18} /> Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden sticky top-0 z-40 bg-navy/95 backdrop-blur border-b border-gold/15 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="text-gold"><Menu size={22} /></button>
          <span className="text-gold font-black tracking-[3px] text-sm">BARB'OR ADMIN</span>
          <button onClick={onLogout} className="text-red-400"><LogOut size={18} /></button>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
