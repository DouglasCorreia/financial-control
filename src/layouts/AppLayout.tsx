import { Link, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'

export default function AppLayout() {
  const signOut = useAuthStore((state) => state.signOut)

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-4">
        <nav className="flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/despesas">Despesas</Link>
          <Link to="/salarios">Salários</Link>
        </nav>

        <Button
          type="button"
          variant="outline"
          onClick={() => void signOut()}
        >
          Sair
        </Button>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}