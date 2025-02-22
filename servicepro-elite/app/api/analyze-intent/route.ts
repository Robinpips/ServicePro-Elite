import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an IT support assistant. Analyze the user input and determine the primary intent or category of the IT issue.",
        },
        {
          role: "user",
          content: input,
        },
      ],
    })

    const intent = response.choices[0].message.content?.toLowerCase() || "unknown"
    return NextResponse.json({ intent })
  } catch (error) {
    console.error("Error analyzing intent:", error)
    return NextResponse.json({ error: "Failed to analyze intent" }, { status: 500 })
  }
}

