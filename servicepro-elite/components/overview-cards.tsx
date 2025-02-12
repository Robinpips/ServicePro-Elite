import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">120</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">35</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closed Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.5h</div>
        </CardContent>
      </Card>
    </div>
  )
}

