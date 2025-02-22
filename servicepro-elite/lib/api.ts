import type { Ticket, User, Team, Category } from "@/types"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to get error details from response
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`)
  }

  try {
    const data = await response.json()
    return data as T
  } catch (error) {
    throw new Error("Failed to parse response data")
  }
}

// API utility functions with improved error handling
export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch("/api/tickets")
    return handleResponse<Ticket[]>(response)
  } catch (error) {
    console.error("Error fetching tickets:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch tickets")
  }
}

export async function createTicket(ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<Ticket> {
  try {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    })
    return handleResponse<Ticket>(response)
  } catch (error) {
    console.error("Error creating ticket:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to create ticket")
  }
}

export async function updateTicket(id: number, ticketData: Partial<Ticket>): Promise<Ticket> {
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    })
    return handleResponse<Ticket>(response)
  } catch (error) {
    console.error("Error updating ticket:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to update ticket")
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch("/api/users")
    return handleResponse<User[]>(response)
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch users")
  }
}

export async function fetchTeams(): Promise<Team[]> {
  try {
    const response = await fetch("/api/teams")
    return handleResponse<Team[]>(response)
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch teams")
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories")
    return handleResponse<Category[]>(response)
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch categories")
  }
}

