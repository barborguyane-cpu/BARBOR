const KEY = 'barbor_admin_auth_v1'

const DEFAULTS = {
  email:    'admin@barbor.gf',
  password: 'Barbor2024!',
}

export function getAdminCredentials() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

export function checkAdminLogin(email, password) {
  const creds = getAdminCredentials()
  return email.trim() === creds.email && password === creds.password
}

export function updateAdminCredentials({ email, password }) {
  const current = getAdminCredentials()
  const next = {
    email:    email    || current.email,
    password: password || current.password,
  }
  localStorage.setItem(KEY, JSON.stringify(next))
}
