import { NextResponse } from "next/server"
import type { User } from "@/types"

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "agent",
  },
]

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

