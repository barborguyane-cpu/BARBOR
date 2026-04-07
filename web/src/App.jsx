import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import { LandingPage }  from './pages/LandingPage.jsx'
import { LoginPage }    from './pages/LoginPage.jsx'
import { LoginModal }   from './components/common/LoginModal.jsx'

import { ClientLayout } from './pages/client/ClientLayout.jsx'
import { HomePage }     from './pages/client/HomePage.jsx'
import { BookingPage }  from './pages/client/BookingPage.jsx'
import { ShopPage }     from './pages/client/ShopPage.jsx'
import { DriverPage }   from './pages/client/DriverPage.jsx'
import { ProfilePage }  from './pages/client/ProfilePage.jsx'

import { AdminLayout }      from './pages/admin/AdminLayout.jsx'
import { DashboardPage }    from './pages/admin/DashboardPage.jsx'
import { AppointmentsPage } from './pages/admin/AppointmentsPage.jsx'
import { EmployeesPage }    from './pages/admin/EmployeesPage.jsx'
import { ProductsPage }     from './pages/admin/ProductsPage.jsx'
import { ClientsPage }      from './pages/admin/ClientsPage.jsx'
import { PointagePage }     from './pages/admin/PointagePage.jsx'
import { CongesPage }       from './pages/admin/CongesPage.jsx'
import { StatsPage }        from './pages/admin/StatsPage.jsx'

// Guard: redirects to /admin-login if not authenticated as admin
function AdminGuard({ auth, children }) {
  if (!auth.loggedIn)          return <Navigate to="/admin-login" replace />
  if (auth.role !== 'admin')   return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [auth, setAuth]                    = useState({ loggedIn: false, role: null })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginCallback, setLoginCallback]  = useState(null)

  const login = (role) => {
    setAuth({ loggedIn: true, role })
    setShowLoginModal(false)
    if (loginCallback) { loginCallback(role); setLoginCallback(null) }
  }
  const logout = () => setAuth({ loggedIn: false, role: null })

  const requireAuth = (onSuccess) => {
    if (auth.loggedIn) { onSuccess?.(auth.role); return true }
    setLoginCallback(() => onSuccess)
    setShowLoginModal(true)
    return false
  }

  return (
    <>
      <Routes>
        {/* ── Landing page ── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Client app (public browse, auth for actions) ── */}
        <Route element={<ClientLayout auth={auth} onLogout={logout} onLogin={() => setShowLoginModal(true)} />}>
          <Route path="/home"    element={<HomePage    auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="/booking" element={<BookingPage auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="/shop"    element={<ShopPage    auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="/driver"  element={<DriverPage  auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="/profile" element={<ProfilePage auth={auth} onRequireAuth={requireAuth} />} />
        </Route>

        {/* ── Admin login (standalone, no client branding) ── */}
        <Route path="/admin-login" element={
          auth.loggedIn && auth.role === 'admin'
            ? <Navigate to="/admin" replace />
            : <LoginPage onLogin={login} />
        } />

        {/* ── Admin dashboard (guarded) ── */}
        <Route path="/admin" element={
          <AdminGuard auth={auth}>
            <AdminLayout onLogout={logout} />
          </AdminGuard>
        }>
          <Route index                element={<DashboardPage />} />
          <Route path="appointments"  element={<AppointmentsPage />} />
          <Route path="employees"     element={<EmployeesPage />} />
          <Route path="pointage"      element={<PointagePage />} />
          <Route path="conges"        element={<CongesPage />} />
          <Route path="stats"         element={<StatsPage />} />
          <Route path="products"      element={<ProductsPage />} />
          <Route path="clients"       element={<ClientsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {showLoginModal && (
        <LoginModal
          onLogin={login}
          onClose={() => { setShowLoginModal(false); setLoginCallback(null) }}
        />
      )}
    </>
  )
}
