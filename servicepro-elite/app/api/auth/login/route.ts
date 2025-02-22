import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import { verifyPassword, users } from "@/lib/auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    // Ensure we can parse the request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      console.error("Failed to parse request body:", e)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
        },
        { status: 400 },
      )
    }

    // Log incoming request (without password)
    console.log("Login attempt for email:", body.email)

    // Validate required fields
    if (!body.email || !body.password) {
      console.log("Missing required fields")
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    const user = users.find((u) => u.email === body.email)

    if (!user) {
      console.log("User not found:", body.email)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    const isValidPassword = await verifyPassword(body.password, user.password)
    console.log("Password verification result:", isValidPassword)

    if (!isValidPassword) {
      console.log("Invalid password for user:", body.email)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // Create token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Create response with proper JSON structure
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 },
    )

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    console.log("Login successful for:", body.email)
    return response
  } catch (error) {
    console.error("Login error:", error)
    // Ensure we return a proper JSON response even for unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

