import { useState } from 'react'
import { CLIENTS } from '../../data/mockData.js'
import { Search, Star, TrendingUp, Users } from 'lucide-react'

export function ClientsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = CLIENTS.filter(c => {
    const matchQ = c.name.toLowerCase().includes(search.toLowerCase()) ||
                   c.phone.includes(search)
    const matchF = filter === 'all' || (filter === 'gold' ? c.loyal : !c.loyal)
    return matchQ && matchF
  })

  const totalRevenue = CLIENTS.reduce((s, c) => s + c.spend, 0)
  const avgSpend     = Math.round(totalRevenue / CLIENTS.length)

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Clients</h1>
        <p className="text-gray-500 text-sm">{CLIENTS.length} clients enregistrés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Users size={18} className="text-gold"/>,     label: 'Total clients',  value: CLIENTS.length,  color: 'text-gold' },
          { icon: <Star  size={18} className="text-yellow-400 fill-yellow-400"/>, label: 'Membres Gold', value: CLIENTS.filter(c=>c.loyal).length, color: 'text-yellow-400' },
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
            placeholder="Rechercher par nom ou téléphone..."
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
          <div key={c.id} className="card flex items-center gap-4 hover:border-gold/20 transition-all cursor-pointer">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                <span className="text-gold font-black text-sm">
                  {c.name.split(' ').map(n=>n[0]).join('')}
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
              <p className="text-gray-400 text-sm">{c.visits} visites</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>Aucun client trouvé</p>
        </div>
      )}
    </div>
  )
}
