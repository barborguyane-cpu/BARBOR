import { useState, useEffect } from 'react'
import { subscribeUsers, subscribeAppointments } from '../../data/firestoreData.js'
import { Search, Star, TrendingUp, Users } from 'lucide-react'

function mergeClients(users, appointments) {
  return users.map(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toUpperCase()
    const appts = appointments.filter(a =>
      a.type === 'appointment' &&
      (a.userId === user.id || a.clientName?.toUpperCase() === fullName)
    )
    const spend     = appts.reduce((s, a) => s + (a.amount || 0), 0)
    const visits    = appts.length
    const lastDate  = appts.map(a => a.date).sort().pop()
    const lastVisit = lastDate
      ? new Date(lastDate + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Aucun RDV'
    return {
      id:        user.id,
      name:      `${user.firstName} ${user.lastName}`,
      phone:     user.phone || '—',
      email:     user.email,
      createdAt: user.createdAt,
      spend,
      visits,
      lastVisit,
      loyal:     visits >= 3 || spend >= 60,
    }
  })
}

export function ClientsPage() {
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')
  const [users,   setUsers]   = useState([])
  const [appts,   setAppts]   = useState([])

  useEffect(() => {
    const u = subscribeUsers(setUsers)
    const a = subscribeAppointments(setAppts)
    return () => { u(); a() }
  }, [])

  const clients = mergeClients(users, appts)

  const filtered = clients.filter(c => {
    const matchQ = c.name.toLowerCase().includes(search.toLowerCase()) ||
                   c.phone.includes(search) ||
                   c.email.toLowerCase().includes(search.toLowerCase())
    const matchF = filter === 'all' || (filter === 'gold' ? c.loyal : !c.loyal)
    return matchQ && matchF
  })

  const totalRevenue = clients.reduce((s, c) => s + c.spend, 0)
  const avgSpend     = clients.length ? Math.round(totalRevenue / clients.length) : 0

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Clients</h1>
        <p className="text-gray-500 text-sm">{clients.length} client{clients.length !== 1 ? 's' : ''} enregistré{clients.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Users size={18} className="text-gold"/>,     label: 'Total clients',  value: clients.length,  color: 'text-gold' },
          { icon: <Star  size={18} className="text-yellow-400 fill-yellow-400"/>, label: 'Membres Gold', value: clients.filter(c=>c.loyal).length, color: 'text-yellow-400' },
          { icon: <TrendingUp size={18} className="text-green-400"/>, label: 'Rev. total', value: `${totalRevenue}€`, color: 'text-green-400' },
          { icon: <TrendingUp size={18} className="text-blue-400"/>,  label: 'Dépense moy.', value: `${avgSpend}€`, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div>{s.icon}</div>
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-4 py-2 flex-1 min-w-48">
          <Search size={16} className="text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone ou email..."
            className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-gray-600" />
        </div>
        <div className="flex bg-surface rounded-xl p-1 border border-white/5">
          {[['all','Tous'],['gold','⭐ Gold'],['regular','Standard']].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === k ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
              }`}>{l}</button>
          ))}
        </div>
      </div>

      {/* Client cards */}
      <div className="grid gap-3">
        {filtered.map(c => (
          <div key={c.id} className="card flex items-center gap-4 hover:border-gold/20 transition-all">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                <span className="text-gold font-black text-sm">
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              {c.loyal && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                  <Star size={10} className="text-black fill-black" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-white">{c.name}</p>
                {c.loyal && <span className="badge-gold text-[9px]">GOLD</span>}
              </div>
              <p className="text-gray-400 text-sm">{c.phone}</p>
              <p className="text-gray-500 text-xs">Dernière visite : {c.lastVisit}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-gold font-black text-xl">{c.spend}€</p>
              <p className="text-gray-400 text-sm">{c.visits} RDV</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>{clients.length === 0 ? 'Aucun client inscrit pour le moment' : 'Aucun client trouvé'}</p>
        </div>
      )}
    </div>
  )
}
