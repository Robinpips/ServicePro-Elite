export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface Article {
  id: number
  title: string
  content: string
  category: string
  tags: string
  author: string
  createdAt: Date
  updatedAt: Date
  attachments: Attachment[]
}

export interface ArticleSuggestion {
  title: string
  content: string
  category: string
  tags: string
  confidence: number
  sourceChat?: string[]
}

