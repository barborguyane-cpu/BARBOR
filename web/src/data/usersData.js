import { saveUserFS } from './firestoreData.js'

const USERS_KEY   = 'barbor_users_v1'
const SESSION_KEY = 'barbor_session_v1'

// ─── Lecture / écriture brute ──────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Encodage basique (pas de sécurité serveur, mais masque le mot de passe)
const encode = (s) => btoa(unescape(encodeURIComponent(s)))
const match  = (plain, stored) => encode(plain) === stored

// ─── Inscription ───────────────────────────────────────────────────────────
export function registerUser({ firstName, lastName, email, phone, password }) {
  const users = getUsers()

  if (!firstName?.trim()) return { error: 'Prénom requis.' }
  if (!lastName?.trim())  return { error: 'Nom requis.' }
  if (!email?.trim())     return { error: 'Email requis.' }
  if (!phone?.trim())     return { error: 'Téléphone requis.' }
  if (!password || password.length < 6) return { error: 'Mot de passe : 6 caractères minimum.' }

  const emailLower = email.toLowerCase().trim()
  if (users.find(u => u.email === emailLower)) {
    return { error: 'Un compte existe déjà avec cet email.' }
  }

  const user = {
    id:        Date.now().toString(),
    firstName: firstName.trim(),
    lastName:  lastName.trim(),
    email:     emailLower,
    phone:     phone.trim(),
    password:  encode(password),
    createdAt: new Date().toISOString(),
    points:    0,
  }

  saveUsers([...users, user])
  saveUserFS(_safe(user)).catch(() => {})   // sync vers Firestore (best-effort)
  const session = _startSession(user)
  return { user: _safe(user), session }
}

// ─── Connexion ─────────────────────────────────────────────────────────────
export function loginUser({ email, password }) {
  if (!email || !password) return { error: 'Email et mot de passe requis.' }

  const users = getUsers()
  const user  = users.find(u => u.email === email.toLowerCase().trim())

  if (!user)              return { error: 'Aucun compte trouvé avec cet email.' }
  if (!match(password, user.password)) return { error: 'Mot de passe incorrect.' }

  const session = _startSession(user)
  return { user: _safe(user), session }
}

// ─── Session persistante ───────────────────────────────────────────────────
function _startSession(user) {
  const session = { userId: user.id, role: 'client' }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (!s?.userId) return null
    const user = getUsers().find(u => u.id === s.userId)
    if (!user) return null
    return { user: _safe(user), role: 'client' }
  } catch { return null }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function updateUser(id, data) {
  const users = getUsers()
  const idx   = users.findIndex(u => u.id === id)
  if (idx === -1) return { error: 'Utilisateur introuvable.' }
  users[idx] = { ...users[idx], ...data }
  if (data.password) users[idx].password = encode(data.password)
  saveUsers(users)
  return { user: _safe(users[idx]) }
}

// ─── Lecture admin ─────────────────────────────────────────────────────────
export function getAllUsers() {
  return getUsers().map(_safe)
}

// Retire le mot de passe des données exposées
function _safe(u) {
  const { password, ...rest } = u
  return rest
}
