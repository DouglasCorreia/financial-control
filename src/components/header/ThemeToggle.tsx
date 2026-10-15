import { Moon, Sun } from 'lucide-react'

import { useThemeStore } from '@/stores/useThemeStore'

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="Modo escuro"
      title={`Alternar para o modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      className="cursor-pointer flex h-9 w-16 items-center justify-between rounded-full border border-border bg-muted p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={`flex size-7 items-center justify-center rounded-full transition-colors ${theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
        <Sun aria-hidden="true" size={16} />
      </span>
      <span className={`flex size-7 items-center justify-center rounded-full transition-colors ${theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
        <Moon aria-hidden="true" size={16} />
      </span>
    </button>
  )
}
