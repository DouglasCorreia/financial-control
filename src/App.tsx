import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Register from './pages/Register'
import AppLayout from './layouts/AppLayout'
import Profile from './pages/Profile'
import Budget from './pages/Budget'
import Categories from './pages/Categories'
import Expenses from './pages/Expenses'

function App() {
  const initialize = useAuthStore((state) => state.initialize)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let isMounted = true

    initialize().then((unsubscribe) => {
      if (isMounted) {
        cleanup = unsubscribe

      } else {
        unsubscribe()
      }
    })

    return () => {
      isMounted = false
      cleanup?.()
    }
  }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/cadastro"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/expenses" element={<Expenses />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
