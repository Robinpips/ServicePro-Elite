import { DashboardShell } from '@/components/dashboard-shell'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { OverviewCards } from '@/components/overview-cards'
import { RecentTickets } from '@/components/recent-tickets'
import { TicketStatusChart } from '@/components/ticket-status-chart'

export default function Home() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to ServicePRO Elite. Manage your IT service desk efficiently."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCards />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentTickets />
        <TicketStatusChart />
      </div>
    </DashboardShell>
  )
}