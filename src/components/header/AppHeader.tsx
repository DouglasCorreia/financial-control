import { useAuthStore } from '@/stores/useAuthStore'
import HeaderMenu from './HeaderMenu'
import ThemeToggle from './ThemeToggle'

export default function AppHeader() {
  const profile = useAuthStore((state) => state.profile)

  return (
    <header className="sticky top-0 w-full border-b border-border bg-background py-4 z-20">
      <div className="container flex items-center justify-between">
        <HeaderMenu />

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <div className="relative group">
            <p className="flex items-center justify-center gap-4 bg-chateau-green-400 rounded-full size-9 text-white font-bold">
              {profile?.nome.charAt(0)}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
