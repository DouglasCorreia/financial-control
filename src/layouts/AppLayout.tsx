import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'

import { useAuthStore } from '@/stores/useAuthStore'

export default function AppLayout() {
  const signOut = useAuthStore((state) => state.signOut)
  const profile = useAuthStore((state) => state.profile);

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleSubmenu = () => {
    setIsMenuOpen((current) => !current)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }
  
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background py-4">
        <div className="container flex items-center justify-end">
          <div className="relative group">
            <p
              className="flex items-center justify-center gap-4 bg-green-400 rounded-full size-9 text-white font-bold cursor-pointer"
              onClick={toggleSubmenu}
              aria-expanded={isMenuOpen}
              aria-controls="profile-menu"
            >
              { profile?.nome.charAt(0) }
            </p>

            <div
              className={`absolute right-0 top-full z-50 mt-2 min-w-64 rounded-2xl border border-green-400 bg-white p-4 text-xs shadow-lg ${
                isMenuOpen ? 'block' : 'hidden'
              }`}
            >
              <p className="text-sm text-gray-700 font-semibold">Bem vindo, { profile?.nome.split(" ")[0] }!</p>

              <nav className="mt-4">
                <ul className="flex flex-col gap-2 text-xs text-gray-600 [&>li>*]:transition-colors [&>li>*]:hover:text-green-400">
                    <li>
                      <Link onClick={closeMenu} className="block cursor-pointer" to="/dashboard">Dashboard</Link>
                    </li>

                    <li>
                      <Link onClick={closeMenu} className="block cursor-pointer" to="/categories">Categoria das despesas</Link>
                    </li>

                    <li>
                      <Link onClick={closeMenu} className="block cursor-pointer" to="/expenses">Despesas</Link>
                    </li>

                    <li>
                      <Link onClick={closeMenu} className="block cursor-pointer" to="/budget">Salário</Link>
                    </li>

                    <li>
                      <Link onClick={closeMenu} className="block cursor-pointer" to="/profile">Editar perfil</Link>
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
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-77px)] flex-col items-center container py-12">
        <Outlet />
      </main>
    </div>
  )
}