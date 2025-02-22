import { NextResponse } from "next/server"
import OpenAI from "openai"
import { searchKnowledgeBase } from "@/lib/knowledge-base"

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Add type safety for the request body
interface RequestBody {
  messages: Array<{
    role: string
    content: string
  }>
}

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    let body: RequestBody
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: "Failed to parse request body",
        },
        { status: 400 },
      )
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        {
          error: "Invalid request format",
          details: "Messages array is required",
        },
        { status: 400 },
      )
    }

    // Get the last user message
    const lastMessage = body.messages[body.messages.length - 1]
    if (!lastMessage?.content) {
      return NextResponse.json(
        {
          error: "Invalid message format",
          details: "Last message must have content",
        },
        { status: 400 },
      )
    }

    // First check existing articles
    let existingArticles = []
    try {
      existingArticles = await searchKnowledgeBase(lastMessage.content)
      if (existingArticles.length > 0) {
        return NextResponse.json({
          suggestion: null,
          existingArticles,
        })
      }
    } catch (searchError) {
      console.error("Knowledge base search error:", searchError)
      // Continue with suggestion generation
    }

    // Generate suggestion if no existing articles found
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a knowledge base article generator. Analyze the conversation and create a knowledge base article that would be helpful for future reference. 
            Only generate an article if the conversation contains clear troubleshooting steps or reusable information.
            Format the response as JSON with the following structure:
            {
              "title": "Brief, descriptive title",
              "content": "Detailed step-by-step content",
              "category": "One of: account, hardware, software, network",
              "tags": "comma,separated,relevant,tags",
              "confidence": "number between 0 and 1 indicating how confident you are this should be an article"
            }
            If the conversation doesn't contain enough information for an article, return { "confidence": 0 }`,
          },
          ...body.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const responseText = completion.choices[0].message.content
      if (!responseText) {
        return NextResponse.json({
          suggestion: null,
          existingArticles: [],
        })
      }

      let suggestion
      try {
        suggestion = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError)
        return NextResponse.json(
          {
            error: "Invalid AI response",
            details: "Failed to parse AI response",
          },
          { status: 500 },
        )
      }

      // Validate suggestion structure
      if (typeof suggestion.confidence !== "number") {
        return NextResponse.json(
          {
            error: "Invalid AI response format",
            details: "Missing or invalid confidence value",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        suggestion:
          suggestion.confidence > 0
            ? {
                ...suggestion,
                sourceChat: body.messages.map((m) => m.content),
              }
            : null,
        existingArticles: [],
      })
    } catch (aiError) {
      console.error("OpenAI API error:", aiError)
      return NextResponse.json(
        {
          error: "AI service error",
          details: aiError instanceof Error ? aiError.message : "AI service unavailable",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Knowledge base suggestion error:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

