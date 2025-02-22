import OpenAI from 'openai'
import StreamingTextResponse from 'openai'
import OpenAIStream from 'openai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, options } = await req.json()

  // Add context to the messages if provided
  if (options?.context) {
    messages.unshift({
      role: 'system',
      content: `Context: ${options.context}`
    })
  }

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages.map((message: any) => ({
      role: message.role,
      content: message.content
    })),
  })

  // Convert the response into a friendly text-stream
  const stream = new OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}

