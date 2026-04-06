import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

// Auth
import { LoginPage }    from './pages/LoginPage.jsx'

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
  const [auth, setAuth] = useState({ loggedIn: false, role: null })

  const login = (role) => setAuth({ loggedIn: true, role })
  const logout = () => setAuth({ loggedIn: false, role: null })

  if (!auth.loggedIn) {
    return <LoginPage onLogin={login} />
  }

  if (auth.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout onLogout={logout} />}>
          <Route index         element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="employees"    element={<EmployeesPage />} />
          <Route path="products"     element={<ProductsPage />} />
          <Route path="clients"      element={<ClientsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<ClientLayout onLogout={logout} />}>
        <Route index            element={<HomePage />} />
        <Route path="booking"   element={<BookingPage />} />
        <Route path="shop"      element={<ShopPage />} />
        <Route path="driver"    element={<DriverPage />} />
        <Route path="profile"   element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
