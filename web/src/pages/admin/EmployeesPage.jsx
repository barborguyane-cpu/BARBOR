import { useState } from 'react'
import { Star, TrendingUp, Users, Plus, X, Edit2, Trash2, Phone, Mail, Calendar, CheckCircle } from 'lucide-react'
import { BARBERS as INITIAL_BARBERS } from '../../data/mockData.js'

const INIT_PERF = {
  b1: { clients: 0, revenue: 0 },
  b5: { clients: 0, revenue: 0 },
}

const ROLE_CONFIG = {
  barber:     { label: 'Barber',     color: 'text-gold',       bg: 'bg-gold/10',       border: 'border-gold/30'       },
  apprentice: { label: 'Apprenti',   color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30'   },
  manager:    { label: 'Manager',    color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
}

const EMPTY_FORM = {
  firstName: '', lastName: '', age: '', specialty: '', role: 'barber',
  phone: '', email: '', available: true,
}

function initials(first, last) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

function EmployeeModal({ emp, onSave, onClose }) {
  const [form, setForm] = useState(emp ? {
    firstName: emp.firstName, lastName: emp.lastName, age: emp.age,
    specialty: emp.specialty, role: emp.role, phone: emp.phone,
    email: emp.email, available: emp.available,
  } : EMPTY_FORM)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return
    onSave(form)
    onClose()
  }

  const isEdit = !!emp

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="font-black text-white text-lg uppercase tracking-widest">
            {isEdit ? 'Modifier l\'employé' : 'Nouvel employé'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Role selector */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Rôle</label>
            <div className="flex gap-2">
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => set('role', key)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all ${
                    form.role === key ? `${cfg.color} ${cfg.bg} ${cfg.border}` : 'border-white/10 text-gray-500 hover:text-white'
                  }`}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Prénom *</label>
              <input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                placeholder="Chadrac"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                           focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Nom *</label>
              <input value={form.lastName} onChange={e => set('lastName', e.target.value.toUpperCase())}
                placeholder="AUBAUNA"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                           focus:outline-none focus:border-white/30 transition-colors uppercase" />
            </div>
          </div>

          {/* Specialty & age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Spécialité</label>
              <input value={form.specialty} onChange={e => set('specialty', e.target.value)}
                placeholder="Dégradés & Designs"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                           focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Âge</label>
              <input type="number" min="16" max="70" value={form.age} onChange={e => set('age', e.target.value)}
                placeholder="20"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                           focus:outline-none focus:border-white/30 transition-colors" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Téléphone</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="+594 694 XX XX XX"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                         focus:outline-none focus:border-white/30 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="prenom@barbor.gf"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700
                         focus:outline-none focus:border-white/30 transition-colors" />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between bg-black rounded-xl border border-white/10 px-4 py-3">
            <div>
              <p className="text-white text-sm font-semibold">Disponible aujourd'hui</p>
              <p className="text-gray-600 text-xs">Apparaît dans le planning et la réservation</p>
            </div>
            <button onClick={() => set('available', !form.available)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.available ? 'bg-green-500' : 'bg-gray-700'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.available ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-white/8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-white/10 text-gray-400 font-bold text-sm rounded-xl hover:border-white/20 hover:text-white transition-all">
            Annuler
          </button>
          <button onClick={handleSave}
            disabled={!form.firstName.trim() || !form.lastName.trim()}
            className="flex-1 py-3 bg-gold text-black font-black text-sm rounded-xl uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center gap-2">
            <CheckCircle size={16} /> {isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState(INITIAL_BARBERS)
  const [perf, setPerf]           = useState(INIT_PERF)
  const [modal, setModal]         = useState(null) // null | 'add' | { emp }
  const [deleteId, setDeleteId]   = useState(null)
  const [search, setSearch]       = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const handleAdd = (form) => {
    const id = `b${Date.now()}`
    const avatar = initials(form.firstName, form.lastName)
    setEmployees(prev => [...prev, {
      id, avatar,
      firstName: form.firstName,
      lastName:  form.lastName,
      age:       Number(form.age) || 0,
      specialty: form.specialty || 'Non défini',
      role:      form.role,
      phone:     form.phone,
      email:     form.email,
      available: form.available,
      rating:    0,
      reviews:   0,
      joinDate:  new Date().toISOString().split('T')[0],
    }])
    setPerf(p => ({ ...p, [id]: { clients: 0, revenue: 0 } }))
  }

  const handleEdit = (id, form) => {
    setEmployees(prev => prev.map(e => e.id !== id ? e : {
      ...e,
      firstName: form.firstName,
      lastName:  form.lastName,
      age:       Number(form.age) || e.age,
      specialty: form.specialty,
      role:      form.role,
      phone:     form.phone,
      email:     form.email,
      available: form.available,
      avatar:    initials(form.firstName, form.lastName),
    }))
  }

  const handleDelete = (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id))
    setDeleteId(null)
  }

  const toggleAvail = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, available: !e.available } : e))
  }

  const filtered = employees.filter(e => {
    const matchSearch = `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())
    const matchRole   = filterRole === 'all' || e.role === filterRole
    return matchSearch && matchRole
  })

  const barberCount     = employees.filter(e => e.role === 'barber').length
  const apprenticeCount = employees.filter(e => e.role === 'apprentice').length
  const availCount      = employees.filter(e => e.available).length
  const avgRating       = employees.filter(e => e.rating > 0).reduce((s, e, _, a) => s + e.rating / a.length, 0).toFixed(1) || '—'
  const totalRevenue    = Object.values(perf).reduce((s, p) => s + p.revenue, 0)

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">Employés</h1>
          <p className="text-gray-500 text-sm">{employees.length} membre{employees.length > 1 ? 's' : ''} dans l'équipe</p>
        </div>
        <button onClick={() => setModal('add')}
          className="btn-gold flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} /> Ajouter un employé
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '💈', label: 'Barbers',      value: barberCount,                        color: 'text-gold'       },
          { icon: '🎓', label: 'Apprentis',    value: apprenticeCount,                    color: 'text-blue-400'   },
          { icon: '🟢', label: 'Disponibles',  value: availCount,                         color: 'text-green-400'  },
          { icon: '💶', label: 'CA ce mois',   value: `${totalRevenue.toLocaleString()}€`, color: 'text-gold'       },
        ].map(s => (
          <div key={s.label} className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-4 text-center space-y-2">
            <span className="text-2xl">{s.icon}</span>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un employé..."
          className="flex-1 min-w-[180px] bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600
                     focus:outline-none focus:border-white/30 transition-colors"
        />
        {['all', 'barber', 'apprentice', 'manager'].map(r => (
          <button key={r} onClick={() => setFilterRole(r)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              filterRole === r ? 'bg-gold text-black' : 'bg-[#0D0D0D] border border-white/10 text-gray-400 hover:text-white'
            }`}>
            {r === 'all' ? 'Tous' : ROLE_CONFIG[r]?.label}
          </button>
        ))}
      </div>

      {/* Employee list */}
      <div className="space-y-3">
        {filtered.map(e => {
          const p    = perf[e.id] || { clients: 0, revenue: 0 }
          const rc   = ROLE_CONFIG[e.role] || ROLE_CONFIG.barber
          const join = e.joinDate ? new Date(e.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—'

          return (
            <div key={e.id} className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start gap-4">

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gold/15 border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-black text-lg">{e.avatar}</span>
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0D0D0D] ${e.available ? 'bg-green-400' : 'bg-gray-600'}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-black text-white text-base">{e.firstName} {e.lastName}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${rc.color} ${rc.bg} ${rc.border}`}>
                      {rc.label}
                    </span>
                    {e.age && <span className="text-gray-600 text-xs">{e.age} ans</span>}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{e.specialty}</p>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    {e.phone && (
                      <span className="flex items-center gap-1"><Phone size={11} />{e.phone}</span>
                    )}
                    {e.email && (
                      <span className="flex items-center gap-1"><Mail size={11} />{e.email}</span>
                    )}
                    {e.joinDate && (
                      <span className="flex items-center gap-1"><Calendar size={11} />Depuis {join}</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Users size={13} className="text-blue-400" />
                      <span className="text-blue-400 font-bold">{p.clients}</span>
                      <span className="text-gray-600 text-xs">clients</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp size={13} className="text-gold" />
                      <span className="text-gold font-bold">{p.revenue}€</span>
                      <span className="text-gray-600 text-xs">CA</span>
                    </div>
                    {e.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={11} className="text-gold fill-gold" />
                        <span className="text-gold font-bold">{e.rating}</span>
                        <span className="text-gray-600 text-xs">({e.reviews})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {/* Availability toggle */}
                  <button onClick={() => toggleAvail(e.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      e.available
                        ? 'text-green-400 bg-green-400/10 border-green-400/30 hover:bg-green-400/20'
                        : 'text-gray-500 bg-white/5 border-white/10 hover:border-white/20'
                    }`}>
                    {e.available ? '● Dispo' : '○ Off'}
                  </button>

                  {/* Edit */}
                  <button onClick={() => setModal({ emp: e })}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 text-gray-400
                      hover:border-gold/40 hover:text-gold transition-all flex items-center gap-1 justify-center">
                    <Edit2 size={11} /> Modifier
                  </button>

                  {/* Delete */}
                  <button onClick={() => setDeleteId(e.id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60
                      hover:border-red-500/40 hover:text-red-400 transition-all flex items-center gap-1 justify-center">
                    <Trash2 size={11} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun employé trouvé</p>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modal === 'add' && (
        <EmployeeModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}
      {modal && modal.emp && (
        <EmployeeModal
          emp={modal.emp}
          onSave={(form) => handleEdit(modal.emp.id, form)}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D0D] border border-red-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-black text-white text-lg">Supprimer l'employé ?</h3>
            <p className="text-gray-400 text-sm">Cette action est irréversible. L'employé sera retiré du système.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border border-white/10 text-gray-400 font-bold text-sm rounded-xl hover:border-white/20 transition-all">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 bg-red-500/80 hover:bg-red-500 text-white font-black text-sm rounded-xl transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
