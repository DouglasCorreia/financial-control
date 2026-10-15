import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import { useAuthStore } from '@/stores/useAuthStore'

export default function HeaderMenu() {
  const signOut = useAuthStore((state) => state.signOut)
  const profile = useAuthStore((state) => state.profile)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <div className="cursor-pointer" onClick={() => setIsMenuOpen((current) => !current)}>
        <Menu />
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-full max-w-96 bg-card border-r-2 border-border z-10 p-4
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="block font-semibold text-muted-foreground">Bem vindo, {profile?.nome}</span>

          <span
            className="cursor-pointer text-muted-foreground h-7 w-7 transition-colors bg-muted lg:hover:text-chateau-green-600 lg:hover:bg-chateau-green-400 flex items-center justify-center rounded-lg"
            onClick={closeMenu}
          >
            <X />
          </span>
        </div>

        <nav>
          <ul className="flex flex-col gap-2 text-xs text-muted-foreground [&>li>*]:font-semibold [&>li>*]:transition-colors lg:[&>li>*]:hover:text-chateau-green-400 lg:[&>li>*]:hover:bg-chateau-green-300 lg:[&>li>*]:hover:text-chateau-green-600">
            <li>
              <Link onClick={closeMenu} className="block cursor-pointer p-2 rounded-md" to="/dashboard">Início</Link>
            </li>
            <li>
              <Link onClick={closeMenu} className="block cursor-pointer p-2 rounded-md" to="/categories">Categoria das despesas</Link>
            </li>
            <li>
              <Link onClick={closeMenu} className="block cursor-pointer p-2 rounded-md" to="/expenses">Despesas</Link>
            </li>
            <li>
              <Link onClick={closeMenu} className="block cursor-pointer p-2 rounded-md" to="/budget">Salário</Link>
            </li>
            <li>
              <Link onClick={closeMenu} className="block cursor-pointer p-2 rounded-md" to="/profile">Editar perfil</Link>
            </li>
            <li>
              <span className="block cursor-pointer p-2 rounded-lg" onClick={() => signOut()}>
                Sair
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
