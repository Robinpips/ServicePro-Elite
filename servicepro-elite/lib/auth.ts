import { hash, compare } from "bcryptjs"

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await compare(password, hashedPassword)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

// User roles type
export type UserRole = "admin" | "agent" | "user"

// User interface
export interface User {
  id: number
  email: string
  password: string
  name: string
  role: UserRole
  department?: string
  teams?: number[]
}

// Mock database - replace with your actual database
export const users: User[] = [
  {
    id: 1,
    email: "demo@servicepro.com",
    // Verified hash for "demo123"
    password: "$2a$12$8l2I0PwRUlDu3pXcg6VoGOHJ.0LZ3m6TqHHNUJwjRKjXsI3.Fnhd2",
    name: "Admin User",
    role: "admin",
    department: "IT",
    teams: [1, 2, 3], // Access to all teams
  },
  {
    id: 2,
    email: "agent@servicepro.com",
    // Hash for "agent123"
    password: "$2a$12$YWGDy5.9JrH7Up/YhRM4XO1xjqZkUOHXZoqHxYoMQXqI4u9GcICFW",
    name: "Support Agent",
    role: "agent",
    department: "Support",
    teams: [1], // Limited team access
  },
]

// Helper function to get user by email
export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email)
}

// Helper function to get user by id
export function getUserById(id: number): User | undefined {
  return users.find((user) => user.id === id)
}

// For development/testing - generates a hash for a password
// Usage: await generateHash("your-password")
export async function generateHash(password: string): Promise<string> {
  return await hashPassword(password)
}

// Example of how the demo123 hash was generated:
// console.log(await generateHash("demo123"))
// Result: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpxQQHMIXG8Eyi

