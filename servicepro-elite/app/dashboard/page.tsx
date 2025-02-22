"use client"

import { useState, useEffect } from "react"
import { DispatchBoard } from "@/components/dispatch-board"
import { TicketDetails } from "@/components/ticket-details"
import { ServiceRequestForm } from "@/components/service-request-form"
import { UserTeamManagement } from "@/components/user-team-management"
import { KnowledgeBase } from "@/components/knowledge-base"
import { Analytics } from "@/components/analytics"
import { AIAssistant } from "@/components/ai-assistant"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  LogOut,
  Menu,
  User,
  Home,
  Users,
  Settings,
  HelpCircle,
  PlusCircle,
  BarChart,
  Book,
  Sparkles,
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Settings as SettingsPage } from "@/components/settings"
import { HelpCenter } from "@/components/help-center"
import type { Ticket, User, Team, Category } from "@/types"
import { fetchTickets, fetchUsers, fetchTeams, fetchCategories, createTicket, updateTicket } from "@/lib/api"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dispatch")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const currentUser = {
    name: "Admin User",
    role: "admin",
    permissions: ["create_ticket", "view_ticket", "edit_ticket"],
    teams: [1, 2, 3],
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const results = await Promise.allSettled([fetchTickets(), fetchUsers(), fetchTeams(), fetchCategories()])

        // Process results and handle individual failures
        const [ticketsResult, usersResult, teamsResult, categoriesResult] = results

        if (ticketsResult.status === "fulfilled") {
          setTickets(ticketsResult.value)
        } else {
          console.error("Failed to fetch tickets:", ticketsResult.reason)
          toast({
            title: "Error",
            description: "Failed to load tickets. Some features may be limited.",
            variant: "destructive",
          })
        }

        if (usersResult.status === "fulfilled") {
          setUsers(usersResult.value)
        } else {
          console.error("Failed to fetch users:", usersResult.reason)
          toast({
            title: "Error",
            description: "Failed to load users. Some features may be limited.",
            variant: "destructive",
          })
        }

        if (teamsResult.status === "fulfilled") {
          setTeams(teamsResult.value)
        } else {
          console.error("Failed to fetch teams:", teamsResult.reason)
          toast({
            title: "Error",
            description: "Failed to load teams. Some features may be limited.",
            variant: "destructive",
          })
        }

        if (categoriesResult.status === "fulfilled") {
          setCategories(categoriesResult.value)
        } else {
          console.error("Failed to fetch categories:", categoriesResult.reason)
          toast({
            title: "Error",
            description: "Failed to load categories. Some features may be limited.",
            variant: "destructive",
          })
        }

        // Check if all requests failed
        const allFailed = results.every((result) => result.status === "rejected")
        if (allFailed) {
          toast({
            title: "Error",
            description: "Failed to load application data. Please try again later.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load initial data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleNewServiceRequest = async (formData: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newTicket = await createTicket(formData)
      setTickets((prev) => [...prev, newTicket])
      toast({
        title: "Service Request Created",
        description: "Your service request has been successfully submitted.",
      })
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTicket = async (updatedTicket: Ticket) => {
    try {
      const updated = await updateTicket(updatedTicket.id, updatedTicket)
      setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)))
      toast({
        title: "Ticket Updated",
        description: "The ticket has been successfully updated.",
      })
      setSelectedTicket(null)
    } catch (error) {
      console.error("Error updating ticket:", error)
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navItems = [
    { name: "Dashboard", tab: "dispatch", icon: Home },
    { name: "Users & Teams", tab: "users", icon: Users },
    { name: "Knowledge Base", tab: "knowledge", icon: Book },
    { name: "Analytics", tab: "analytics", icon: BarChart },
    { name: "AI Assistant", tab: "ai", icon: Sparkles },
    { name: "Settings", tab: "settings", icon: Settings },
    { name: "Help", tab: "help", icon: HelpCircle },
  ]

  const Sidebar = ({ className = "" }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-2xl font-semibold">ServicePRO Elite</h2>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.tab}>
              <Button
                variant={activeTab === item.tab ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.tab)
                  setSidebarOpen(false)
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-4">
          <User className="w-6 h-6" />
          <div>
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-sm text-gray-500">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fc]">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:block w-64 bg-white shadow-lg">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-grow w-full md:w-[calc(100%-16rem)] overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden mr-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="hidden sm:flex">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">New Request</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Service Request</DialogTitle>
                    <DialogDescription>Fill out the form to create a new service request.</DialogDescription>
                  </DialogHeader>
                  <ServiceRequestForm
                    onSubmit={handleNewServiceRequest}
                    teams={teams}
                    users={users}
                    categories={categories}
                  />
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Bell className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dispatch">
              <DispatchBoard tickets={tickets} onSelectTicket={setSelectedTicket} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="users">
              <UserTeamManagement users={users} teams={teams} />
            </TabsContent>
            <TabsContent value="knowledge">
              <KnowledgeBase />
            </TabsContent>
            <TabsContent value="analytics">
              <Analytics tickets={tickets} />
            </TabsContent>
            <TabsContent value="ai">
              <AIAssistant />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsPage />
            </TabsContent>
            <TabsContent value="help">
              <HelpCenter />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Ticket details sidebar */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          {selectedTicket && (
            <TicketDetails
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
              onSave={handleUpdateTicket}
            />
          )}
        </SheetContent>
      </Sheet>

      <Toaster />
    </div>
  )
}

