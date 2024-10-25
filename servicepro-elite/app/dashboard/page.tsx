import { Suspense } from 'react'
import { DashboardShell } from '../../components/DashboardShell'
import { DashboardHeader } from '../../components/DashboardHeader'
import { OverviewCards } from '@/components/overview-cards'
import { RecentTickets } from '@/components/recent-tickets'
import { TicketStatusChart } from '@/components/ticket-status-chart'
import { CardSkeleton } from '@/components/ui/card-skeleton'

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to ServicePRO Elite. Manage your IT service desk efficiently."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <OverviewCards />
        </Suspense>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Suspense fallback={<CardSkeleton />}>
          <RecentTickets />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <TicketStatusChart />
        </Suspense>
      </div>
    </DashboardShell>
  )
}