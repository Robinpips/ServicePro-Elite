import { NextResponse } from "next/server"
import type { Team } from "@/types"

const teams: Team[] = [
  {
    id: 1,
    name: "IT Support",
    members: [1, 2],
  },
  {
    id: 2,
    name: "Customer Service",
    members: [2],
  },
]

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json(teams)
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

