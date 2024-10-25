'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Home, Users, Book, BarChart, Clock, Settings, Menu } from 'lucide-react'

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Tickets',
    href: '/dashboard/tickets',
    icon: Users,
  },
  {
    title: 'Knowledge Base',
    href: '/dashboard/knowledge-base',
    icon: Book,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart,
  },
  {
    title: 'Timesheet',
    href: '/dashboard/timesheet',
    icon: Clock,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
}

export function Sidebar({ className, open, onClose }: SidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileNav />
      </SheetContent>
      <div className={cn('pb-12 hidden lg:block', className)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              ServicePRO Elite
            </h2>
            <div className="space-y-1">
              <Nav />
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  )
}

function Nav() {
  const pathname = usePathname()
  return (
    <nav className="space-y-1">
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
            pathname === item.href
              ? 'bg-accent text-accent-foreground'
              : 'transparent'
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}

function MobileNav() {
  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10  pl-6">
      <div className="flex flex-col space-y-3">
        {sidebarNavItems.map((item) => (
          <MobileLink key={item.href} href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </MobileLink>
        ))}
      </div>
    </ScrollArea>
  )
}

function MobileLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
        pathname === href
          ? 'bg-accent text-accent-foreground'
          : 'transparent'
      )}
    >
      {children}
    </Link>
  )
}