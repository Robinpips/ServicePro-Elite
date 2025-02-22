import { NextResponse } from "next/server"
import type { Category } from "@/types"

const categories: Category[] = [
  {
    id: 1,
    name: "Network",
  },
  {
    id: 2,
    name: "Hardware",
  },
  {
    id: 3,
    name: "Software",
  },
]

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

