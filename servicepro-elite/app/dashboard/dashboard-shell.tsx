import { Sidebar } from '@/components/sidebar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-background">
        <main className="flex-1 p-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}