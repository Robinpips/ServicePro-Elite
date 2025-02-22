"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Save } from "lucide-react"

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

interface TicketDetailsProps {
  ticket: Ticket | null
  onClose: () => void
  onSave: (ticket: Ticket) => void
}

export function TicketDetails({ ticket, onClose, onSave }: TicketDetailsProps) {
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    if (ticket) {
      setEditedTicket(ticket)
    }
  }, [ticket])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTicket((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSave = () => {
    if (editedTicket) {
      onSave(editedTicket)
    }
    onClose()
  }

  if (!editedTicket) {
    return (
      <div className="p-4">
        <p>No ticket selected or ticket data is unavailable.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="space-y-4 md:space-y-6 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 bg-background z-10 pb-4 border-b">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">{editedTicket.title}</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={editedTicket.title} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editedTicket.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      value={editedTicket.status}
                      onValueChange={(value) => setEditedTicket((prev) => (prev ? { ...prev, status: value } : null))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      name="priority"
                      value={editedTicket.priority}
                      onValueChange={(value) => setEditedTicket((prev) => (prev ? { ...prev, priority: value } : null))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requester">Requester</Label>
                    <Input id="requester" name="requester" value={editedTicket.requester} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editedTicket.scheduledDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editedTicket.scheduledDate ? (
                            format(new Date(editedTicket.scheduledDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editedTicket.scheduledDate ? new Date(editedTicket.scheduledDate) : undefined}
                          onSelect={(date) =>
                            setEditedTicket((prev) => (prev ? { ...prev, scheduledDate: date } : null))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <Input id="attachments" type="file" multiple />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: "John Doe", action: "updated the status to In Progress", time: "2 hours ago" },
                    { user: "Jane Smith", action: "added a comment", time: "1 day ago" },
                    { user: "Admin", action: "created the ticket", time: "2 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder-user-${index + 1}.jpg`} />
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {activity.user} {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
          <Button variant="outline" onClick={onClose} className="w-full md:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

