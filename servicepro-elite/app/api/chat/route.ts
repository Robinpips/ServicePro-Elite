import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get the context from the last message if it exists
  const context = messages[messages.length - 1]?.context || ""

  // Create the system message with context
  const systemMessage = {
    role: "system",
    content: `You are a helpful IT service desk assistant. Your role is to help users with their technical issues and service requests.
    ${context ? `Additional context: ${context}` : ""}`,
  }

  // Request the OpenAI API for the chat completion
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      systemMessage,
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    ],
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream)
}

