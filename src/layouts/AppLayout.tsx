import { Link, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/stores/useAuthStore'

export default function AppLayout() {
  const signOut = useAuthStore((state) => state.signOut)
  const profile = useAuthStore((state) => state.profile);
  
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-end border-b bg-background px-6 py-4">
        <div className="relative group">
            <p className="flex items-center justify-center gap-4 bg-green-400 rounded-full size-9 text-white font-bold">
              { profile?.nome.charAt(0) }
            </p>

            <div className="absolute group-hover:block top-full right-0 bg-white text-xs min-w-64 p-4 rounded-2xl border border-green-400 shadow-lg mt-2">
              <p className="text-sm text-gray-700 font-semibold">Bem vindo, { profile?.nome.split(" ")[0] }!</p>

              <nav className="mt-4">
                <ul className="flex flex-col gap-2 text-xs text-gray-600 [&>li>*]:transition-colors [&>li>*]:hover:text-green-400">
                    <li>
                      <Link className="block cursor-pointer" to="/dashboard">Dashboard</Link>
                    </li>

                    <li>
                      <Link className="block cursor-pointer" to="/despesas">Despesas</Link>
                    </li>

                    <li>
                      <Link className="block cursor-pointer" to="/budget">Salário</Link>
                    </li>

                    <li>
                      <Link className="block cursor-pointer" to="/profile">Editar perfil</Link>
                    </li>

                    <li>
                      <span className="cursor-pointer block" onClick={() => signOut()}>
                        Sair
                      </span>
                    </li>
                  </ul>
              </nav>
            </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-77px)] flex-col items-center justify-center container">
        <Outlet />
      </main>
    </div>
  )
}