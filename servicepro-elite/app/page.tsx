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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, LogOut, Menu, PlusCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Settings as SettingsComponent } from "@/components/settings"
import { HelpCenter } from "@/components/help-center"
import Sidebar from "@/components/sidebar"

interface Ticket {
  id: number
  title: string
  description: string
  status: string
  priority: string
  assignedTo: string
  team: string
  requester: string
  scheduledDate?: Date
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Team {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

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

  const handleNewServiceRequest = (newTicket: any) => {
    // Handle creating a new service request
    console.log("New ticket:", newTicket)
    toast({
      title: "Service request created",
      description: "Your service request has been successfully created.",
    })
  }

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    // Handle updating an existing ticket
    console.log("Updated ticket:", updatedTicket)
    toast({
      title: "Ticket updated",
      description: "Your ticket has been successfully updated.",
    })
    setSelectedTicket(null)
  }

  useEffect(() => {
    // Fetch data for tickets, users, teams, and categories
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Replace with your actual API calls
        const ticketsData = await fetch("/api/tickets").then((res) => res.json())
        const usersData = await fetch("/api/users").then((res) => res.json())
        const teamsData = await fetch("/api/teams").then((res) => res.json())
        const categoriesData = await fetch("/api/categories").then((res) => res.json())

        setTickets(ticketsData)
        setUsers(usersData)
        setTeams(teamsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error fetching data",
          description: "There was an error fetching data from the server.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:block w-64 bg-white shadow-lg">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
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
                  <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
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
            <TabsList>
              <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="help">Help Center</TabsTrigger>
            </TabsList>
            <TabsContent value="dispatch">
              <DispatchBoard tickets={tickets} onSelectTicket={setSelectedTicket} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="users">
              <UserTeamManagement
                users={users}
                teams={teams}
                onUpdateUser={(updatedUser) => {
                  setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
                }}
                onUpdateTeam={(updatedTeam) => {
                  setTeams((prevTeams) => prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team)))
                }}
              />
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
              <SettingsComponent />
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

