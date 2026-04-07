import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

// Auth
import { LoginPage }    from './pages/LoginPage.jsx'
import { LoginModal }   from './components/common/LoginModal.jsx'

// Client pages
import { ClientLayout } from './pages/client/ClientLayout.jsx'
import { HomePage }     from './pages/client/HomePage.jsx'
import { BookingPage }  from './pages/client/BookingPage.jsx'
import { ShopPage }     from './pages/client/ShopPage.jsx'
import { DriverPage }   from './pages/client/DriverPage.jsx'
import { ProfilePage }  from './pages/client/ProfilePage.jsx'

// Admin pages
import { AdminLayout }      from './pages/admin/AdminLayout.jsx'
import { DashboardPage }    from './pages/admin/DashboardPage.jsx'
import { AppointmentsPage } from './pages/admin/AppointmentsPage.jsx'
import { EmployeesPage }    from './pages/admin/EmployeesPage.jsx'
import { ProductsPage }     from './pages/admin/ProductsPage.jsx'
import { ClientsPage }      from './pages/admin/ClientsPage.jsx'

export default function App() {
  const [auth, setAuth]             = useState({ loggedIn: false, role: null })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginCallback, setLoginCallback]  = useState(null)

  const login = (role) => {
    setAuth({ loggedIn: true, role })
    setShowLoginModal(false)
    // Execute pending action after login
    if (loginCallback) {
      loginCallback(role)
      setLoginCallback(null)
    }
  }

  const logout = () => setAuth({ loggedIn: false, role: null })

  // Called by pages when a protected action is triggered
  const requireAuth = (onSuccess) => {
    if (auth.loggedIn) {
      onSuccess?.(auth.role)
      return true
    }
    setLoginCallback(() => onSuccess)
    setShowLoginModal(true)
    return false
  }

  // Admin: full login wall (no public admin)
  if (auth.loggedIn && auth.role === 'admin') {
    return (
      <>
        <Routes>
          <Route path="/admin" element={<AdminLayout onLogout={logout} />}>
            <Route index                  element={<DashboardPage />} />
            <Route path="appointments"    element={<AppointmentsPage />} />
            <Route path="employees"       element={<EmployeesPage />} />
            <Route path="products"        element={<ProductsPage />} />
            <Route path="clients"         element={<ClientsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </>
    )
  }

  // Client / Guest: public navigation, login required for actions
  return (
    <>
      <Routes>
        <Route path="/" element={<ClientLayout auth={auth} onLogout={logout} onLogin={() => setShowLoginModal(true)} />}>
          <Route index          element={<HomePage auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="booking" element={<BookingPage auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="shop"    element={<ShopPage auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="driver"  element={<DriverPage auth={auth} onRequireAuth={requireAuth} />} />
          <Route path="profile" element={<ProfilePage auth={auth} onRequireAuth={requireAuth} />} />
        </Route>
        {/* Admin login */}
        <Route path="/admin-login" element={<LoginPage onLogin={login} adminOnly />} />
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
