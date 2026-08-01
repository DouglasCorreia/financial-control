import { Link, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'

export default function AppLayout() {
  const signOut = useAuthStore((state) => state.signOut)
  const profile = useAuthStore((state) => state.profile);
  
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-4">
        <nav className="flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/despesas">Despesas</Link>
          <Link to="/salarios">Salários</Link>
        </nav>

        <div className="relative">
            <p className="flex items-center justify-center gap-4 bg-green-400 rounded-full size-9 text-white font-bold">
              { profile?.nome.charAt(0) }
            </p>

            <div className="absolute top-full right-0 bg-white text-xs min-w-52 p-4 rounded-2xl border border-green-300 shadow-lg mt-2">
              <p className="text-sm font-semibold">Bem vindo, { profile?.nome }!</p>

              <ul>
                <li>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void signOut()}
                    className="btn-ok"
                  >
                    Sair
                  </Button>
                </li>
              </ul>
            </div>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}