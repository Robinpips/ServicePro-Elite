import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RecentTickets() {
  const recentTickets = [
    { id: "1", title: "Server Down", status: "Open", priority: "High" },
    { id: "2", title: "Email Not Working", status: "In Progress", priority: "Medium" },
    { id: "3", title: "Password Reset", status: "Closed", priority: "Low" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

