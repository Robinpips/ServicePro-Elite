import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 mb-6">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-wide text-primary">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Ticket
      </Button>
    </div>
  )
}