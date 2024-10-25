import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const recentTickets = [
  {
    id: 'TICKET-1234',
    title: 'Server Down',
    status: 'Critical',
    assignedTo: 'John Doe',
    createdAt: '2023-06-20T10:30:00Z',
  },
  {
    id: 'TICKET-1235',
    title: 'Email Not Working',
    status: 'High',
    assignedTo: 'Jane Smith',
    createdAt: '2023-06-20T11:45:00Z',
  },
  {
    id: 'TICKET-1236',
    title: 'Password Reset',
    status: 'Medium',
    assignedTo: 'Bob Johnson',
    createdAt: '2023-06-20T13:15:00Z',
  },
  {
    id: 'TICKET-1237',
    title: 'New Software Installation',
    status: 'Low',
    assignedTo: 'Alice Brown',
    createdAt: '2023-06-20T14:30:00Z',
  },
]

export function RecentTickets() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Badge variant={ticket.status === 'Critical' ? 'destructive' : 'secondary'}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell className="text-right">
                  {new Date(ticket.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}