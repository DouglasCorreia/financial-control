import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { LoaderCircle } from 'lucide-react'

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user)
  const isloading = useAuthStore((state) => state.isLoading)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      {
        isloading ? (
          <div className="flex min-h-screen items-center justify-center">
            <LoaderCircle className="h-12 w-12 animate-spin text-green-300" />  
          </div>
        ) : (
          <Outlet />
        )
      }
    </>
  )
}