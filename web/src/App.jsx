import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { LandingPage }  from './pages/LandingPage.jsx'
import { LoginPage }    from './pages/LoginPage.jsx'
import { LoginModal }   from './components/common/LoginModal.jsx'

import { ClientLayout } from './pages/client/ClientLayout.jsx'
import { BookingPage }  from './pages/client/BookingPage.jsx'
import { ShopPage }     from './pages/client/ShopPage.jsx'
import { DriverPage }   from './pages/client/DriverPage.jsx'
import { ProfilePage }  from './pages/client/ProfilePage.jsx'
import { PlanningPage } from './pages/client/PlanningPage.jsx'

import { AdminLayout }      from './pages/admin/AdminLayout.jsx'
import { DashboardPage }    from './pages/admin/DashboardPage.jsx'
import { AppointmentsPage } from './pages/admin/AppointmentsPage.jsx'
import { EmployeesPage }    from './pages/admin/EmployeesPage.jsx'
import { ProductsPage }     from './pages/admin/ProductsPage.jsx'
import { ClientsPage }      from './pages/admin/ClientsPage.jsx'
import { PointagePage }     from './pages/admin/PointagePage.jsx'
import { CongesPage }       from './pages/admin/CongesPage.jsx'
import { StatsPage }        from './pages/admin/StatsPage.jsx'
import { SiteEditorPage }    from './pages/admin/SiteEditorPage.jsx'
import { ReviewsAdminPage } from './pages/admin/ReviewsAdminPage.jsx'
import { MediaPage }        from './pages/admin/MediaPage.jsx'
import { SettingsPage }    from './pages/admin/SettingsPage.jsx'

import { getSession, clearSession } from './data/usersData.js'

function AdminGuard({ auth, children }) {
  if (!auth.loggedIn)          return <Navigate to="/admin-login" replace />
  if (auth.role !== 'admin')   return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [auth, setAuth] = useState(() => {
    // Restaure la session client au chargement
    const s = getSession()
    if (s) return { loggedIn: true, role: 'client', user: s.user }
    return { loggedIn: false, role: null, user: null }
  })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginCallback, setLoginCallback]  = useState(null)

  const login = (role, user = null) => {
    setAuth({ loggedIn: true, role, user })
    setShowLoginModal(false)
    if (loginCallback) { loginCallback(role); setLoginCallback(null) }
  }

  const logout = () => {
    clearSession()
    setAuth({ loggedIn: false, role: null, user: null })
  }

  const requireAuth = (onSuccess) => {
    if (auth.loggedIn) { onSuccess?.(auth.role); return true }
    setLoginCallback(() => onSuccess)
    setShowLoginModal(true)
    return false
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route element={<ClientLayout auth={auth} onLogout={logout} onLogin={() => setShowLoginModal(true)} />}>
          <Route path="/booking" element={<BookingPage auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="/shop"    element={<ShopPage    auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="/driver"  element={<DriverPage  auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="/profile"  element={<ProfilePage  auth={auth} onRequireAuth={requireAuth} onLogin={() => setShowLoginModal(true)} onLogout={logout} />} />
          <Route path="/planning" element={<PlanningPage />} />
        </Route>

        <Route path="/admin-login" element={
          auth.loggedIn && auth.role === 'admin'
            ? <Navigate to="/admin" replace />
            : <LoginPage onLogin={login} />
        } />

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
          <Route path="site"          element={<SiteEditorPage />} />
          <Route path="reviews"       element={<ReviewsAdminPage />} />
          <Route path="media"         element={<MediaPage />} />
          <Route path="settings"      element={<SettingsPage />} />
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
