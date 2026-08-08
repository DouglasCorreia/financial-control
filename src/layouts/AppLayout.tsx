import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'

import { Menu, X } from 'lucide-react';

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
      <header className="fixed md:sticky top-0 w-full border-b border-gray-200 bg-background py-4 z-10">
        <div className="container flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={toggleSubmenu}
          >
            <Menu />
          </div>

          <div 
            className={`fixed top-0 left-0 w-full h-full max-w-96 bg-white border-r-2 border-r-gray-200 z-10 p-4
              transform transition-transform duration-300 ease-in-out
              ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="block font-semibold">Bem vindo, { profile?.nome }</span>

              <span
                className="cursor-pointer"
                onClick={toggleSubmenu}
              >
                <X />
              </span>
            </div>

            <nav>
              <ul className="flex flex-col gap-2 text-xs text-gray-600 [&>li>*]:font-normal [&>li>*]:transition-colors [&>li>*]:hover:text-chateau-green-400">
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

          <div className="relative group">
            <p
              className="flex items-center justify-center gap-4 bg-chateau-green-400 rounded-full size-9 text-white font-bold cursor-pointer"
            >
              { profile?.nome.charAt(0) }
            </p>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-77px)] flex-col items-center container py-12">
        <Outlet />
      </main>
    </div>
  )
}