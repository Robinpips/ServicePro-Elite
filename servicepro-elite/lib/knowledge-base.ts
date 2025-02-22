import type { Article } from "@/types/knowledge-base"

// In-memory storage for knowledge base articles
let articles: Article[] = []

export async function searchKnowledgeBase(query: string): Promise<Article[]> {
  try {
    const searchTerms = query.toLowerCase().split(" ")

    return articles
      .filter((article) => {
        const content = `${article.title} ${article.content} ${article.tags}`.toLowerCase()
        return searchTerms.some((term) => content.includes(term))
      })
      .sort((a, b) => {
        // Sort by relevance (number of matching terms)
        const aMatches = searchTerms.filter((term) =>
          `${a.title} ${a.content} ${a.tags}`.toLowerCase().includes(term),
        ).length
        const bMatches = searchTerms.filter((term) =>
          `${b.title} ${b.content} ${b.tags}`.toLowerCase().includes(term),
        ).length
        return bMatches - aMatches
      })
  } catch (error) {
    console.error("Error searching knowledge base:", error)
    return []
  }
}

export async function addArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<Article> {
  try {
    const newArticle: Article = {
      ...article,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    articles.push(newArticle)
    return newArticle
  } catch (error) {
    console.error("Error adding article:", error)
    throw new Error("Failed to add article to knowledge base")
  }
}

export async function updateArticle(id: number, updates: Partial<Article>): Promise<Article> {
  const index = articles.findIndex((a) => a.id === id)
  if (index === -1) throw new Error("Article not found")

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date(),
  }

  return articles[index]
}

export async function getAllArticles(): Promise<Article[]> {
  return articles
}

export async function getArticleById(id: number): Promise<Article | null> {
  return articles.find((a) => a.id === id) || null
}

// Initialize with some default articles
articles = [
  {
    id: 1,
    title: "Common Password Reset Procedures",
    content:
      "1. Visit the password reset portal\n2. Enter your employee ID\n3. Check your email for verification\n4. Create a new password\n5. Log in with your new password",
    category: "account",
    tags: "password,security,access",
    author: "System",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    attachments: [],
  },
  {
    id: 2,
    title: "Basic Network Troubleshooting",
    content:
      "1. Check physical connections\n2. Verify WiFi connection\n3. Restart network devices\n4. Run network diagnostics\n5. Contact IT support if issues persist",
    category: "network",
    tags: "network,connectivity,troubleshooting",
    author: "System",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    attachments: [],
  },
]

