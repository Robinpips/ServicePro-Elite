import { NextResponse } from "next/server"
import { users } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Check if user exists
    const user = users.find((u) => u.email === email)
    if (!user) {
      // For security reasons, we still return success even if the email doesn't exist
      return NextResponse.json(
        {
          message: "If an account exists with this email, you will receive password reset instructions.",
        },
        { status: 200 },
      )
    }

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Save it to the database with an expiration
    // 3. Send an email with a reset link
    // For demo purposes, we'll just return success

    return NextResponse.json(
      {
        message: "If an account exists with this email, you will receive password reset instructions.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ message: "An error occurred while processing your request." }, { status: 500 })
  }
}

