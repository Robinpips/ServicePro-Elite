import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function Analytics({ tickets }) {
  // Calculate ticket statistics
  const ticketStats = tickets.reduce((acc, ticket) => {
    acc.total++
    acc[ticket.status] = (acc[ticket.status] || 0) + 1
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
    return acc
  }, { total: 0 })

  const statusData = Object.entries(ticketStats)
    .filter(([key]) => key !== 'total')
    .map(([name, value]) => ({ name, value }))

  const priorityData = [
    { name: 'Low', value: ticketStats.low || 0 },
    { name: 'Medium', value: ticketStats.medium || 0 },
    { name: 'High', value: ticketStats.high || 0 },
    { name: 'Urgent', value: ticketStats.urgent || 0 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="overview" className="flex-1 sm:flex-none">Overview</TabsTrigger>
        <TabsTrigger value="status" className="flex-1 sm:flex-none">Status</TabsTrigger>
        <TabsTrigger value="priority" className="flex-1 sm:flex-none">Priority</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.open || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.closed || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.high || 0}</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="status">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Overview of tickets by their current status</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="priority">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Priority Distribution</CardTitle>
            <CardDescription>Overview of tickets by their priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

