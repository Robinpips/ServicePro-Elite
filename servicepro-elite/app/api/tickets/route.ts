import { NextResponse } from "next/server"
import type { Ticket } from "@/types"

// Mock data - replace with your actual data source
const tickets: Ticket[] = [
  {
    id: 1,
    title: "Network Issue",
    description: "Unable to connect to the network",
    status: "open",
    priority: "high",
    assignedTo: "John Doe",
    team: "IT Support",
    requester: "Jane Smith",
    category: "Network",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Printer Not Working",
    description: "Office printer showing error",
    status: "in-progress",
    priority: "medium",
    assignedTo: "Mike Johnson",
    team: "IT Support",
    requester: "Bob Wilson",
    category: "Hardware",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const newTicket: Ticket = {
      ...data,
      id: tickets.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    tickets.push(newTicket)
    return NextResponse.json(newTicket)
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

