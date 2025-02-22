"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  Search,
  Filter,
  ChevronRight,
  MoreVertical,
  Folder,
  FileText,
  Briefcase,
  BarChart2,
  Settings,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
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
}

// Update the FolderType to be more specific
type FolderType = "folder" | "project" | "task"

interface FolderBase {
  id: string
  name: string
  type: FolderType
  parentId?: string | null
  children: string[]
  tickets: number[]
  icon?: React.ElementType
  color?: string
  expanded?: boolean
}

interface Project extends FolderBase {
  type: "project"
  startDate?: string
  endDate?: string
  status: "not-started" | "in-progress" | "completed"
  owner?: string
  priority: "low" | "medium" | "high"
}

interface Task extends FolderBase {
  type: "task"
  dueDate?: string
  assignee?: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  dependencies?: string[]
}

interface Folder extends FolderBase {
  type: "folder"
}

type FolderItem = Folder | Project | Task

interface DispatchBoardProps {
  tickets: Ticket[]
  onSelectTicket: (ticket: Ticket) => void
  isLoading: boolean
}

// Default folders with improved structure
const defaultFolders: FolderItem[] = [
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    children: ["website-project", "erp-implementation"],
    tickets: [],
    icon: Briefcase,
  },
  {
    id: "website-project",
    name: "Website Redesign",
    type: "project",
    parentId: "projects",
    children: ["frontend-tasks", "backend-tasks"],
    tickets: [],
    status: "in-progress",
    priority: "high",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    owner: "John Doe",
  },
  {
    id: "frontend-tasks",
    name: "Frontend Development",
    type: "folder",
    parentId: "website-project",
    children: ["homepage-task", "about-page-task"],
    tickets: [],
  },
  {
    id: "homepage-task",
    name: "Homepage Development",
    type: "task",
    parentId: "frontend-tasks",
    children: [],
    tickets: [1, 2],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-03-01",
    assignee: "Jane Smith",
  },
]

export function DispatchBoard({ tickets, onSelectTicket, isLoading }: DispatchBoardProps) {
  const [folders, setFolders] = useState<FolderItem[]>(defaultFolders)
  const [selectedFolder, setSelectedFolder] = useState<string | null>("projects")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["projects"]))
  const [newItemData, setNewItemData] = useState({
    name: "",
    type: "folder" as FolderType,
    description: "",
    dueDate: "",
    assignee: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewItemDialog, setShowNewItemDialog] = useState(false)
  const [newItemType, setNewItemType] = useState<FolderType>("folder")
  const { toast } = useToast()

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId)
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const handleCreateNewItem = () => {
    if (!newItemData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    const newId = `${newItemType}-${Date.now()}`
    const parentId = selectedFolder

    let newItem: FolderItem

    switch (newItemType) {
      case "project":
        newItem = {
          id: newId,
          name: newItemData.name,
          type: "project",
          parentId,
          children: [],
          tickets: [],
          status: "not-started",
          priority: newItemData.priority as "low" | "medium" | "high",
          startDate: new Date().toISOString(),
          endDate: newItemData.dueDate,
          owner: newItemData.assignee || undefined,
        } as Project
        break

      case "task":
        newItem = {
          id: newId,
          name: newItemData.name,
          type: "task",
          parentId,
          children: [],
          tickets: [],
          status: "todo",
          priority: newItemData.priority as "low" | "medium" | "high",
          dueDate: newItemData.dueDate,
          assignee: newItemData.assignee || undefined,
        } as Task
        break

      default:
        newItem = {
          id: newId,
          name: newItemData.name,
          type: "folder",
          parentId,
          children: [],
          tickets: [],
        } as Folder
    }

    // Add this right before the setFolders call
    console.log("Creating new item:", {
      newItem,
      parentId,
      currentFolders: folders,
    })

    // Update the folders state
    setFolders((prev) => {
      // First, create a new array with the new item
      const updated = [...prev, newItem]

      // Then, if there's a parent folder, update its children
      if (parentId) {
        return updated.map((folder) => {
          if (folder.id === parentId) {
            return {
              ...folder,
              children: [...folder.children, newId],
            }
          }
          return folder
        })
      }

      return updated
    })

    // Add this after the setFolders call
    console.log("Updated folders:", folders)

    // Expand the parent folder if it exists
    if (parentId) {
      setExpandedFolders((prev) => new Set([...prev, parentId]))
    }

    // Reset form and close dialog
    setShowNewItemDialog(false)
    setNewItemData({
      name: "",
      type: "folder",
      description: "",
      dueDate: "",
      assignee: "",
      priority: "medium",
    })

    toast({
      title: "Success",
      description: `New ${newItemType} created successfully`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-progress":
        return "bg-blue-500"
      case "completed":
      case "done":
        return "bg-green-500"
      case "not-started":
      case "todo":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
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

  const renderFolderIcon = (type: FolderType) => {
    switch (type) {
      case "project":
        return <Briefcase className="h-4 w-4" />
      case "task":
        return <FileText className="h-4 w-4" />
      default:
        return <Folder className="h-4 w-4" />
    }
  }

  const renderFolderTree = (parentId: string | null = null, level = 0) => {
    return folders
      .filter((folder) => folder.parentId === parentId)
      .map((folder) => {
        const isExpanded = expandedFolders.has(folder.id)
        const isSelected = selectedFolder === folder.id
        const hasChildren = folder.children.length > 0
        const Icon = folder.icon || renderFolderIcon(folder.type)

        return (
          <div key={folder.id} className="space-y-1">
            <Button
              variant={isSelected ? "secondary" : "ghost"}
              className={cn("w-full justify-start", level > 0 && `pl-${level * 4}`, isSelected && "bg-accent")}
              onClick={() => handleFolderClick(folder.id)}
            >
              <div className="flex items-center flex-1">
                {hasChildren && (
                  <ChevronRight
                    className={cn("h-4 w-4 mr-2 transition-transform", isExpanded && "transform rotate-90")}
                  />
                )}
                {!hasChildren && <div className="w-6" />}
                <Icon className="mr-2 h-4 w-4" />
                <span className="flex-1 truncate">{folder.name}</span>
                {folder.type !== "folder" && (
                  <div className="flex items-center space-x-2">
                    {"status" in folder && <Badge className={getStatusColor(folder.status)}>{folder.status}</Badge>}
                    {"priority" in folder && (
                      <Badge className={getPriorityColor(folder.priority)}>{folder.priority}</Badge>
                    )}
                  </div>
                )}
                {folder.tickets.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {folder.tickets.length}
                  </Badge>
                )}
              </div>
            </Button>
            {isExpanded && hasChildren && (
              <div className="ml-4 border-l pl-4">{renderFolderTree(folder.id, level + 1)}</div>
            )}
          </div>
        )
      })
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchQuery.toLowerCase().trim() === "" ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const belongsToFolder = !selectedFolder || ticket.folderId === selectedFolder

    return matchesSearch && belongsToFolder
  })

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg border bg-white">
      {/* Left Sidebar - Project Tree */}
      <div className="w-72 border-r bg-[#f8f9fc]">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
          </div>
          <Tabs defaultValue="workflow" className="flex-1">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="workflow"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Workflow
              </TabsTrigger>
              <TabsTrigger
                value="catalog"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Catalog
              </TabsTrigger>
            </TabsList>
            <TabsContent value="workflow" className="flex-1 p-0">
              <div className="space-y-1 p-2 overflow-auto h-[calc(100vh-16rem)]">{renderFolderTree(null)}</div>
            </TabsContent>
            <TabsContent value="catalog" className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Service Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {["IT Support", "Hardware", "Software", "Network", "Security"].map((category) => (
                        <Button
                          key={category}
                          variant="ghost"
                          className="w-full justify-start rounded-none px-4 py-2 font-normal"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#f8f9fc]">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-4 gap-4 p-4">
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                <h3 className="text-2xl font-bold">{tickets.filter((t) => t.status === "open").length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <h3 className="text-2xl font-bold">{tickets.filter((t) => t.priority === "high").length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="border-y bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <BarChart2 className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                Create Ticket
              </Button>
            </div>
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="font-semibold">Assigned To</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "bg-opacity-10 text-xs",
                            ticket.status === "open" && "bg-blue-500 text-blue-700",
                            ticket.status === "in-progress" && "bg-yellow-500 text-yellow-700",
                            ticket.status === "closed" && "bg-green-500 text-green-700",
                          )}
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "bg-opacity-10 text-xs",
                            ticket.priority === "high" && "bg-red-500 text-red-700",
                            ticket.priority === "medium" && "bg-yellow-500 text-yellow-700",
                            ticket.priority === "low" && "bg-green-500 text-green-700",
                          )}
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assignedTo}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => onSelectTicket(ticket)}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>

      {/* New Item Dialog */}
      <Dialog open={showNewItemDialog} onOpenChange={setShowNewItemDialog}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreateNewItem()
            }}
          >
            <DialogHeader>
              <DialogTitle>Create New {newItemType}</DialogTitle>
              <DialogDescription>Fill in the details to create a new {newItemType}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              {(newItemType === "project" || newItemType === "task") && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItemData.description}
                      onChange={(e) =>
                        setNewItemData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newItemData.dueDate}
                      onChange={(e) => setNewItemData((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newItemData.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setNewItemData((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newItemType === "task" && (
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Input
                        id="assignee"
                        value={newItemData.assignee}
                        onChange={(e) =>
                          setNewItemData((prev) => ({
                            ...prev,
                            assignee: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewItemDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create {newItemType}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

