import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import GlobalLoading from '@/components/GlobalLoading'

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user)
  const isloading = useAuthStore((state) => state.isLoading)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (isloading){
    return <GlobalLoading />
  }

  return <Outlet />
}