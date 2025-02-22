import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Temporarily disable authentication
export function middleware(request: NextRequest) {
  // Allow all requests
  return NextResponse.next()
}

// Configure paths that should be protected (currently disabled)
export const config = {
  matcher: [],
}

