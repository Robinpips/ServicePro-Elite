'use client'

import { Sidebar } from '@/components/sidebar'
import { useState } from 'react'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 overflow-auto bg-background">
        <main className="flex-1 p-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}