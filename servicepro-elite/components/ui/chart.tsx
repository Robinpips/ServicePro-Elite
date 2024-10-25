"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface ChartProps {
  config: {
    [key: string]: {
      label: string
      color: string
    }
  }
  className?: string
  children: React.ReactNode
}

export function ChartContainer({ config, className, children }: ChartProps) {
  const { theme: mode } = useTheme()

  const cssVariables = Object.entries(config).reduce((acc, [key, value]) => {
    acc[`--color-${key}`] = value.color
    return acc
  }, {} as Record<string, string>)

  return (
    <div className={className} style={cssVariables}>
      {children}
    </div>
  )
}

export function ChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function ChartTooltipContent() {
  return null
}