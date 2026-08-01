import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { LoaderCircle } from "lucide-react"

import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Register from './pages/Register'
import AppLayout from './layouts/AppLayout'

function App() {
  const initialize = useAuthStore((state) => state.initialize)
  const isLoading = useAuthStore((state) => state.isLoading)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let isMounted = true

    void initialize().then((unsubscribe) => {
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

  if (isLoading) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center">
          <LoaderCircle className="h-12 w-12 animate-spin text-green-300" />
        </div>
      </>
    )
  }

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
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
