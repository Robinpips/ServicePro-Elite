import { NextResponse } from "next/server"
import OpenAI from "openai"
import { addArticle, updateArticle, getArticleById } from "@/lib/knowledge-base"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { articleId, newInformation } = await req.json()

    // If articleId is provided, update existing article
    if (articleId) {
      const existingArticle = await getArticleById(articleId)
      if (!existingArticle) {
        throw new Error("Article not found")
      }

      // Use AI to merge existing content with new information
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledge base article updater. Merge the existing article with new information to create an updated, comprehensive article. Maintain the same style and format.",
          },
          {
            role: "user",
            content: `Existing article: ${existingArticle.content}\n\nNew information: ${newInformation}`,
          },
        ],
      })

      const updatedContent = completion.choices[0].message.content || existingArticle.content

      const updatedArticle = await updateArticle(articleId, {
        content: updatedContent,
        updatedAt: new Date(),
      })

      return NextResponse.json(updatedArticle)
    }

    // If no articleId, create new article from the information
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Create a knowledge base article from the following information. 
          Format the response as JSON with:
          {
            "title": "Brief, descriptive title",
            "content": "Detailed step-by-step content",
            "category": "One of: account, hardware, software, network",
            "tags": "comma,separated,relevant,tags"
          }`,
        },
        {
          role: "user",
          content: newInformation,
        },
      ],
    })

    const articleData = JSON.parse(completion.choices[0].message.content || "{}")

    const newArticle = await addArticle({
      ...articleData,
      author: "AI Assistant",
      attachments: [],
    })

    return NextResponse.json(newArticle)
  } catch (error) {
    console.error("Error learning from information:", error)
    return NextResponse.json({ error: "Failed to learn from information" }, { status: 500 })
  }
}

