import { useState } from 'react'
import { LogOut, Settings, ChevronRight, User, Phone, Mail, Edit2, Check, X } from 'lucide-react'
import { updateUser } from '../../data/usersData.js'

const inp = `w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
  placeholder:text-gray-700 focus:outline-none focus:border-gold/50 transition-colors`

export function ProfilePage({ auth, onRequireAuth, onLogin, onLogout }) {
  const user = auth?.user
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName,  setLastName]  = useState(user?.lastName  || '')
  const [phone,     setPhone]     = useState(user?.phone     || '')
  const [saved,     setSaved]     = useState(false)

  if (!auth?.loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center">
          <User size={32} className="text-gold/60" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Mon Profil</h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Connectez-vous pour accéder à votre espace personnel et suivre vos rendez-vous.
          </p>
        </div>
        <button onClick={onLogin} className="btn-gold px-10 py-4">
          Se connecter / S'inscrire
        </button>
      </div>
    )
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  const joinDate = user.createdAt
    ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))
    : ''

  const saveEdit = () => {
    const res = updateUser(user.id, { firstName, lastName, phone })
    if (!res.error) {
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const cancelEdit = () => {
    setFirstName(user.firstName); setLastName(user.lastName); setPhone(user.phone)
    setEditing(false)
  }

  return (
    <div className="px-4 py-6 pb-8 space-y-6 max-w-lg mx-auto">

      {/* Carte profil */}
      <div className="bg-[#0D0D0D] border border-white/8 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center border-2 border-gold/50 shrink-0">
              <span className="text-black font-black text-xl">{initials}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">Membre depuis {joinDate}</p>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="p-2 text-gray-600 hover:text-gold transition-colors">
              <Edit2 size={16} />
            </button>
          )}
        </div>

        {/* Infos ou formulaire édition */}
        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Prénom</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Nom</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} className={inp} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Téléphone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inp} />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={saveEdit}
                className="flex-1 py-2.5 rounded-xl bg-gold text-black text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-gold/90 transition-colors">
                <Check size={14} /> Enregistrer
              </button>
              <button onClick={cancelEdit}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors">
                <X size={14} /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {saved && (
              <p className="text-green-400 text-xs flex items-center gap-1.5">
                <Check size={12} /> Modifications enregistrées
              </p>
            )}
            <div className="flex items-center gap-3 py-2 border-b border-white/5">
              <Mail size={14} className="text-gold/60 shrink-0" />
              <span className="text-gray-300 text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Phone size={14} className="text-gold/60 shrink-0" />
              <span className="text-gray-300 text-sm">{user.phone || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Section compte */}
      <div className="bg-[#0D0D0D] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Mon compte</p>
        </div>
        <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/3 transition-colors text-left border-b border-white/5">
          <Settings size={16} className="text-gray-500" />
          <span className="flex-1 text-sm text-white">Paramètres</span>
          <ChevronRight size={14} className="text-gray-600" />
        </button>
        <button onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-500/5 transition-colors text-left text-red-400">
          <LogOut size={16} />
          <span className="flex-1 text-sm font-semibold">Se déconnecter</span>
        </button>
      </div>

      <p className="text-center text-gray-700 text-xs">BARB'OR GUYANE · v2.0</p>
    </div>
  )
}
