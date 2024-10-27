'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const data = [
  { name: 'Critical', value: 12 },
  { name: 'High', value: 45 },
  { name: 'Medium', value: 78 },
  { name: 'Low', value: 34 },
]

const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE']

export function TicketStatusChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Ticket Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 mr-1 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}