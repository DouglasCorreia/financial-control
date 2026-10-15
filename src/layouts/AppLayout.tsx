import { Outlet } from 'react-router-dom'

import AppHeader from '@/components/header/AppHeader'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />

      <main className="flex min-h-[calc(100vh-77px)] flex-col items-center container py-12">
        <Outlet />
      </main>
    </div>
  )
}
