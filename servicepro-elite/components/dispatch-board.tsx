"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Loader2,
  Bell,
  MoreVertical,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Filter,
  Trash2,
  MoveRight,
  RefreshCcw,
  Folders,
  Globe,
  Layout,
  FileCode,
  Database,
  FileText,
  Settings,
  Plus,
  FolderPlus,
  FilePlus,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Ticket {
  id: number
  title: string
  status: string
  priority: string
  assignedTo: string
  folderId?: string
  type?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  description: string
  notifications?: {
    email?: boolean
    sms?: boolean
    chat?: boolean
  }
}

// Update the Folder interface to support hierarchy
interface Folder {
  id: string
  name: string
  icon: any
  color?: string
  expanded?: boolean
  parentId?: string | null
  type: "folder" | "project" | "task"
  children: string[] // IDs of child folders/tasks
  tickets: number[]
  properties?: {
    workflow?: string
    routing?: string[]
    notifications?: {
      email?: boolean
      sms?: boolean
      chat?: boolean
    }
    priority?: string
    startDate?: string
    dueDate?: string
    dependencies?: string[] // IDs of dependent tasks
  }
}

interface DispatchBoardProps {
  tickets: Ticket[]
  onSelectTicket: (ticket: Ticket) => void
  isLoading: boolean
}

// Add sample hierarchical folders
const defaultFolders: Folder[] = [
  {
    id: "projects",
    name: "Projects",
    icon: Folders,
    type: "folder",
    children: ["website-project", "erp-implementation"],
    tickets: [],
  },
  {
    id: "website-project",
    name: "New Website Project",
    icon: Globe,
    parentId: "projects",
    type: "project",
    children: ["frontend-tasks", "backend-tasks", "content-tasks"],
    tickets: [],
    properties: {
      workflow: "web-development",
      priority: "high",
      startDate: "2024-02-01",
      dueDate: "2024-05-01",
    },
  },
  {
    id: "frontend-tasks",
    name: "Frontend Development",
    icon: Layout,
    parentId: "website-project",
    type: "folder",
    children: ["homepage", "about-page", "contact-page"],
    tickets: [],
  },
  {
    id: "homepage",
    name: "Homepage Development",
    icon: FileCode,
    parentId: "frontend-tasks",
    type: "task",
    children: [],
    tickets: [1, 2], // Assign some ticket IDs
    properties: {
      workflow: "frontend-dev",
      priority: "high",
      startDate: "2024-02-01",
      dueDate: "2024-03-01",
      dependencies: ["design-approval"],
    },
  },
  {
    id: "about-page",
    name: "About Page Development",
    icon: FileCode,
    parentId: "frontend-tasks",
    type: "task",
    children: [],
    tickets: [3], // Assign a ticket ID
    properties: {
      workflow: "frontend-dev",
      priority: "medium",
      startDate: "2024-02-15",
      dueDate: "2024-03-15",
    },
  },
  {
    id: "backend-tasks",
    name: "Backend Development",
    icon: Database,
    parentId: "website-project",
    type: "folder",
    children: ["api-development", "database-setup"],
    tickets: [],
  },
  {
    id: "content-tasks",
    name: "Content Management",
    icon: FileText,
    parentId: "website-project",
    type: "folder",
    children: ["content-creation", "content-review"],
    tickets: [],
  },
  {
    id: "erp-implementation",
    name: "ERP Implementation",
    icon: Settings,
    parentId: "projects",
    type: "project",
    children: ["requirements", "configuration", "training"],
    tickets: [],
    properties: {
      workflow: "erp-implementation",
      priority: "high",
      startDate: "2024-03-01",
      dueDate: "2024-08-01",
    },
  },
]

export function DispatchBoard({ tickets, onSelectTicket, isLoading }: DispatchBoardProps) {
  const [folders, setFolders] = useState<Folder[]>(defaultFolders)
  const [selectedFolder, setSelectedFolder] = useState("projects") // Start with projects folder
  const [selectedTickets, setSelectedTickets] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null)
  const { toast } = useToast()
  const tableRef = useRef<HTMLDivElement>(null)

  // Add these state declarations after the existing ones
  const [activeFolder, setActiveFolder] = useState<Folder>(folders[0])
  const [folderCounts, setFolderCounts] = useState<Record<string, number>>({})
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["projects"]) // Start with projects expanded

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500"

    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-500"
      case "in progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-blue-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return "bg-gray-500"

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const sendNotification = (ticketIds: number[], type: "email" | "sms" | "chat") => {
    if (!notificationMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a notification message",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Notification sent",
      description: `${type.toUpperCase()} notification sent to ${ticketIds.length} recipient(s)`,
    })
    setNotificationMessage("")
    setSelectedTickets([])
  }

  const toggleTicketSelection = (ticketId: number) => {
    setSelectedTickets((prev) => (prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]))
  }

  const handleTicketClick = (ticket: Ticket) => {
    setPreviewTicket(ticket)
    setShowPreview(true)
  }

  const filteredTickets = tickets.filter((ticket) => {
    // First check if ticket matches search query
    const matchesSearch =
      searchQuery.toLowerCase().trim() === "" ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Then check if ticket belongs to selected folder or its children
    const selectedFolderObj = folders.find((f) => f.id === selectedFolder)
    if (!selectedFolderObj) return false

    const getAllChildFolderIds = (folderId: string): string[] => {
      const folder = folders.find((f) => f.id === folderId)
      if (!folder) return []
      return [folderId, ...folder.children.flatMap((childId) => getAllChildFolderIds(childId))]
    }

    const relevantFolderIds = getAllChildFolderIds(selectedFolder)
    const belongsToFolder = relevantFolderIds.includes(ticket.folderId || "")

    return matchesSearch && belongsToFolder
  })

  const refreshData = () => {
    toast({
      title: "Refreshing data",
      description: "Updating ticket information...",
    })
    // Implement actual refresh logic here
  }

  // Add these handler functions before the return statement
  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder.id)
    setActiveFolder(folder)
    setSelectedTickets([])

    // Toggle folder expansion only if the folder has children
    if (folder.children.length > 0) {
      setExpandedFolders((prev) =>
        prev.includes(folder.id) ? prev.filter((id) => id !== folder.id) : [...prev, folder.id],
      )
    }

    // Update the ticket list to show tickets for this folder
    const ticketsInFolder = tickets.filter((t) => t.folderId === folder.id)
    console.log(`Showing ${ticketsInFolder.length} tickets for folder ${folder.name}`)
  }

  const handleAddFolder = (type: "project" | "folder" | "task") => {
    // Implementation for adding new folders/projects/tasks
    toast({
      title: `New ${type} created`,
      description: `The ${type} has been created successfully.`,
    })
  }

  const handleMoveToFolder = (ticketIds: number[], folderId: string) => {
    // Update tickets with new folder
    const updatedTickets = tickets.map((ticket) => (ticketIds.includes(ticket.id) ? { ...ticket, folderId } : ticket))

    // Update folder counts
    const newCounts = folders.reduce(
      (acc, folder) => ({
        ...acc,
        [folder.id]: updatedTickets.filter((t) => t.folderId === folder.id).length,
      }),
      {},
    )

    setFolderCounts(newCounts)
    setSelectedTickets([])

    toast({
      title: "Tickets moved",
      description: `${ticketIds.length} ticket(s) moved to ${folders.find((f) => f.id === folderId)?.name}`,
    })
  }

  const handleDeleteTickets = (ticketIds: number[]) => {
    // Here you would typically call an API to delete the tickets
    toast({
      title: "Tickets deleted",
      description: `${ticketIds.length} ticket(s) deleted`,
    })
    setSelectedTickets([])
  }

  const handleRowClick = (e: React.MouseEvent, ticket: Ticket) => {
    // Only trigger if the click wasn't on a button or checkbox
    if (!(e.target as HTMLElement).closest('button, input[type="checkbox"]')) {
      handleTicketClick(ticket)
    }
  }

  useEffect(() => {
    const counts = folders.reduce(
      (acc, folder) => ({
        ...acc,
        [folder.id]: tickets.filter((t) => t.folderId === folder.id).length,
      }),
      {},
    )
    setFolderCounts(counts)
  }, [tickets, folders])

  useEffect(() => {
    console.log("Selected folder:", selectedFolder)
    console.log("Active folder:", activeFolder)
    console.log("Expanded folders:", expandedFolders)
    console.log("Filtered tickets:", filteredTickets)
  }, [selectedFolder, activeFolder, expandedFolders, filteredTickets])

  const renderFolderTree = (folders: Folder[], parentId: string | null) => {
    return folders
      .filter((folder) => folder.parentId === parentId)
      .map((folder) => (
        <div key={folder.id} className="space-y-1">
          <Button
            variant={selectedFolder === folder.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              folder.parentId && "pl-8",
              selectedFolder === folder.id && "bg-accent",
            )}
            onClick={() => handleFolderClick(folder)}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 mr-2 transition-transform",
                expandedFolders.includes(folder.id) && "transform rotate-90",
              )}
            />
            <folder.icon className="mr-2 h-4 w-4" style={{ color: folder.color }} />
            <span className="flex-1 text-left truncate">{folder.name}</span>
            {folder.tickets.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {folder.tickets.length}
              </Badge>
            )}
          </Button>
          {expandedFolders.includes(folder.id) && folder.children.length > 0 && (
            <div className="ml-4 border-l pl-4">{renderFolderTree(folders, folder.id)}</div>
          )}
        </div>
      ))
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg border">
      {/* Left Sidebar - Project Folders */}
      <div className="w-72 border-r bg-muted/50">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">PROJECTS & TASKS</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={refreshData}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleAddFolder("project")}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFolder("folder")}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFolder("task")}>
                    <FilePlus className="h-4 w-4 mr-2" />
                    New Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-1">{renderFolderTree(folders, null)}</div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 bg-muted/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter tickets</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              {selectedTickets.length > 0 && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Notify
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Notification</DialogTitle>
                        <DialogDescription>Send a notification to the selected ticket owners.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Message</Label>
                          <Textarea
                            placeholder="Enter your notification message..."
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => sendNotification(selectedTickets, "email")}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline" onClick={() => sendNotification(selectedTickets, "sms")}>
                          <Phone className="h-4 w-4 mr-2" />
                          Send SMS
                        </Button>
                        <Button onClick={() => sendNotification(selectedTickets, "chat")}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Chat
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoveRight className="h-4 w-4 mr-2" />
                        Move To
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {folders.map((folder) => {
                        const Icon = folder.icon
                        return (
                          <DropdownMenuItem
                            key={folder.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveToFolder(selectedTickets, folder.id)
                            }}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {folder.name}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 flex">
          <div className="flex-1 overflow-hidden" ref={tableRef}>
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredTickets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedTickets.length === filteredTickets.length}
                          onChange={() => {
                            if (selectedTickets.length === filteredTickets.length) {
                              setSelectedTickets([])
                            } else {
                              setSelectedTickets(filteredTickets.map((t) => t.id))
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="w-[60px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead className="w-[150px]">Assigned To</TableHead>
                      <TableHead className="w-[120px]">Due Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={(e) => handleRowClick(e, ticket)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => toggleTicketSelection(ticket.id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>#{ticket.id}</TableCell>
                        <TableCell className="font-medium">{ticket.title}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status || "Unknown"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority || "Unknown"}</Badge>
                        </TableCell>
                        <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                        <TableCell>{ticket.dueDate || "No date"}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSelectTicket(ticket)
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSelectTicket(ticket)
                                }}
                              >
                                Edit Ticket
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Assign To</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Move to</DropdownMenuLabel>
                              {folders.map((folder) => {
                                const Icon = folder.icon
                                return (
                                  <DropdownMenuItem
                                    key={folder.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMoveToFolder([ticket.id], folder.id)
                                    }}
                                  >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {folder.name}
                                  </DropdownMenuItem>
                                )
                              })}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTickets([ticket.id])
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p>No tickets available.</p>
                </div>
              )}
              {filteredTickets.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No tickets match your search"
                      : `No tickets in ${activeFolder?.name || "selected folder"}`}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Preview Pane */}
          <Sheet open={showPreview} onOpenChange={setShowPreview}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
              {previewTicket && (
                <Card className="h-full rounded-none border-0">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                          #{previewTicket.id} {previewTicket.title}
                        </h2>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(previewTicket.status)}>{previewTicket.status}</Badge>
                          <Badge className={getPriorityColor(previewTicket.priority)}>{previewTicket.priority}</Badge>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div>
                          <Label>Assigned To</Label>
                          <p className="text-sm">{previewTicket.assignedTo || "Unassigned"}</p>
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <p className="text-sm">{previewTicket.dueDate || "No date set"}</p>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <p className="text-sm whitespace-pre-wrap">{previewTicket.description}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Activity</Label>
                        <div className="text-sm text-muted-foreground">
                          <p>Created: {previewTicket.createdAt}</p>
                          <p>Last Updated: {previewTicket.updatedAt}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

