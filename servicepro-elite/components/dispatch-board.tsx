import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

interface Ticket {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignedTo: string;
}

interface DispatchBoardProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  isLoading: boolean;
}

export function DispatchBoard({ tickets, onSelectTicket, isLoading }: DispatchBoardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-500'
      case 'in progress': return 'bg-yellow-500'
      case 'resolved': return 'bg-blue-500'
      case 'closed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch Board</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : Array.isArray(tickets) && tickets.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead className="max-w-[150px] hidden sm:table-cell">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell className="max-w-[150px] hidden sm:table-cell">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{ticket.assignedTo}</TableCell>
                    <TableCell>
                      <Button onClick={() => onSelectTicket(ticket)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4">
            <p>No tickets available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

