'use client'

import { Sidebar } from '@/components/sidebar'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={true} onClose={() => {}} />
      <div className="flex-1 overflow-auto bg-background">
        <main className="flex-1 p-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}