"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, ThumbsUp, ThumbsDown, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ServiceRequestForm } from "@/components/service-request-form"
import type { Article, ArticleSuggestion } from "@/types/knowledge-base"

// Temporary mock implementations until the actual implementations are created
const authenticateUser = async (username: string, password: string) => {
  // Mock authentication
  return {
    id: 1,
    name: username,
    role: "user",
    department: "IT",
    language: "en",
  }
}

const createTicket = async (userId: number, messages: any[]) => {
  // Mock ticket creation
  return { id: Math.floor(Math.random() * 10000) }
}

const updateBotKnowledge = async (question: string, answer: string, isPositive: boolean) => {
  // Mock knowledge update
  console.log("Updating bot knowledge:", { question, answer, isPositive })
}

const translate = async (text: string, language: string) => {
  // Mock translation
  return text
}

const botResponses: Record<string, any> = {
  tms_login: {
    content: "I can help you with TMS login issues. What specific problem are you experiencing?",
    category: "Login",
    intents: ["I can't log into TMS"],
  },
  printer_issues: {
    content: "Let's troubleshoot your printer problems. Is the printer showing any error messages?",
    category: "Hardware",
    intents: ["My printer is not working"],
  },
  vpn_connection: {
    content: "I'll help you with your VPN connection. First, can you verify if you can connect to other networks?",
    category: "Network",
    intents: ["VPN not working"],
  },
  slow_computer: {
    content: "Let's diagnose why your computer is running slowly. When did you first notice the performance issues?",
    category: "Performance",
    intents: ["Computer is slow"],
  },
  email_issues: {
    content:
      "I can assist with your email problems. Are you having trouble sending, receiving, or accessing your email?",
    category: "Email",
    intents: ["Email not working"],
  },
  software_installation: {
    content: "I'll guide you through the software installation process. Which software are you trying to install?",
    category: "Software",
    intents: ["Need to install software"],
  },
  password_reset: {
    content: "I can help you reset your password. Which system do you need the password reset for?",
    category: "Security",
    intents: ["Need password reset"],
  },
  default: {
    content: "I'll help you with that. Could you provide more details about your issue?",
    category: "General",
  },
}

interface User {
  id: number
  name: string
  role: string
  department: string
  language: string
}

interface Message {
  content: string
  sender: "user" | "bot"
  category?: string
  resources?: string[]
  attachment?: File
}

interface Team {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

// Update the knowledge base structure with categories and more detailed articles
const mockKnowledgeBase = {
  categories: [
    {
      id: 1,
      name: "Account & Access",
      articles: [
        {
          id: 101,
          title: "Password Reset Guide",
          content:
            "To reset your password:\n1. Visit the password reset portal\n2. Enter your employee ID\n3. Check your email for verification\n4. Create a new password following security guidelines\n5. Log in with your new password",
          tags: ["password", "login", "security"],
          lastUpdated: "2024-02-20",
        },
        {
          id: 102,
          title: "Multi-Factor Authentication Setup",
          content:
            "Setting up MFA:\n1. Download the authenticator app\n2. Log into your account\n3. Go to security settings\n4. Scan the QR code\n5. Enter the verification code",
          tags: ["mfa", "security", "authentication"],
          lastUpdated: "2024-02-19",
        },
      ],
    },
    {
      id: 2,
      name: "Hardware & Printers",
      articles: [
        {
          id: 201,
          title: "Common Printer Issues",
          content:
            "Troubleshooting steps:\n1. Check power and network connections\n2. Verify printer queue\n3. Clear paper jams\n4. Reset printer spooler\n5. Update printer drivers",
          tags: ["printer", "hardware", "troubleshooting"],
          lastUpdated: "2024-02-18",
        },
        {
          id: 202,
          title: "Setting Up Remote Work Equipment",
          content:
            "Remote setup guide:\n1. Connect to power\n2. Install VPN client\n3. Configure monitors\n4. Test audio/video\n5. Verify network connection",
          tags: ["hardware", "remote", "setup"],
          lastUpdated: "2024-02-17",
        },
      ],
    },
    {
      id: 3,
      name: "Software & Applications",
      articles: [
        {
          id: 301,
          title: "VPN Connection Guide",
          content:
            "VPN connection steps:\n1. Install latest VPN client\n2. Enter your credentials\n3. Select appropriate server\n4. Test connection\n5. Contact IT if issues persist",
          tags: ["vpn", "network", "remote"],
          lastUpdated: "2024-02-16",
        },
        {
          id: 302,
          title: "Email Client Setup",
          content:
            "Email setup process:\n1. Open email client\n2. Enter company email\n3. Use SSO for authentication\n4. Configure sync settings\n5. Test sending/receiving",
          tags: ["email", "outlook", "configuration"],
          lastUpdated: "2024-02-15",
        },
      ],
    },
  ],
}

// Enhanced search function with relevance scoring
const searchKnowledgeBase = async (
  query: string,
): Promise<
  Array<{
    title: string
    content: string
    category: string
    relevance: number
    lastUpdated: string
  }>
> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const results: Array<any> = []
    const searchTerms = query.toLowerCase().split(" ")

    mockKnowledgeBase.categories.forEach((category) => {
      category.articles.forEach((article) => {
        // Calculate relevance score based on matches in title, content, and tags
        let relevance = 0

        // Check title matches (higher weight)
        searchTerms.forEach((term) => {
          if (article.title.toLowerCase().includes(term)) relevance += 3
          if (article.content.toLowerCase().includes(term)) relevance += 1
          article.tags.forEach((tag) => {
            if (tag.toLowerCase().includes(term)) relevance += 2
          })
        })

        // Only include results with some relevance
        if (relevance > 0) {
          results.push({
            title: article.title,
            content: article.content,
            category: category.name,
            relevance,
            lastUpdated: article.lastUpdated,
          })
        }
      })
    })

    // Sort by relevance score
    return results.sort((a, b) => b.relevance - a.relevance)
  } catch (error) {
    console.error("Error searching knowledge base:", error)
    return []
  }
}

// Enhanced response function with better formatting
const enhanceResponseWithKnowledge = (
  botResponse: string,
  knowledgeArticles: Array<{
    title: string
    content: string
    category: string
    relevance: number
    lastUpdated: string
  }>,
) => {
  if (knowledgeArticles.length === 0) return botResponse

  // Take only the top 2 most relevant articles
  const topArticles = knowledgeArticles.slice(0, 2)

  const relevantArticles = topArticles
    .map(
      (article) =>
        `\n\n📚 From ${article.category}:\n` +
        `${article.title}\n` +
        `${article.content}\n` +
        `Last updated: ${new Date(article.lastUpdated).toLocaleDateString()}`,
    )
    .join("\n\n")

  return `${botResponse}\n\nI found some relevant articles that might help:${relevantArticles}\n\nWould you like me to provide more specific information about any of these topics?`
}

interface AIAssistantProps {
  teams: Team[]
  users: User[]
  categories: Category[]
  onCreateTicket: (formData: any) => Promise<any>
  isLoading: boolean
  onAddKnowledgeArticle: (article: Omit<Article, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

const quickAccessOptions = [
  { value: "tms_login", label: "TMS Login Issues" },
  { value: "printer_issues", label: "Printer Problems" },
  { value: "vpn_connection", label: "VPN Connection Issues" },
  { value: "slow_computer", label: "Computer Running Slowly" },
  { value: "email_issues", label: "Email Problems" },
  { value: "software_installation", label: "Software Installation" },
  { value: "password_reset", label: "Password Reset" },
]

const supportedLanguages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
]

// Add type safety for API responses
interface KnowledgeBaseResponse {
  suggestion: ArticleSuggestion | null
  existingArticles: Article[]
  error?: string
  details?: string
}

export function AIAssistant({
  teams,
  users,
  categories,
  onCreateTicket,
  isLoading,
  onAddKnowledgeArticle,
}: AIAssistantProps) {
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackQuestion, setFeedbackQuestion] = useState("")
  const [feedbackAnswer, setFeedbackAnswer] = useState("")
  const [isPositiveFeedback, setIsPositiveFeedback] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [isAILoading, setIsAILoading] = useState(false)
  const [articleSuggestion, setArticleSuggestion] = useState<ArticleSuggestion | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])

  // Move checkKnowledgeBase inside the component
  const checkKnowledgeBase = async (message: string): Promise<boolean> => {
    try {
      // Format messages for the API
      const formattedMessages = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      }))

      // Add the current message
      formattedMessages.push({
        role: "user",
        content: message,
      })

      const response = await fetch("/api/knowledge-base/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: formattedMessages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`)
      }

      let data: KnowledgeBaseResponse
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error("Failed to parse response from knowledge base")
      }

      // Validate response structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response structure")
      }

      // Handle error response
      if (data.error) {
        throw new Error(`API Error: ${data.error}${data.details ? ` - ${data.details}` : ""}`)
      }

      // Reset previous state
      setArticleSuggestion(null)
      setRelatedArticles([])

      // Handle existing articles
      if (Array.isArray(data.existingArticles) && data.existingArticles.length > 0) {
        console.log("Found existing articles:", data.existingArticles)
        setRelatedArticles(data.existingArticles)
        return true
      }

      // Handle suggestion
      if (
        data.suggestion &&
        typeof data.suggestion === "object" &&
        "confidence" in data.suggestion &&
        typeof data.suggestion.confidence === "number" &&
        data.suggestion.confidence > 0.8
      ) {
        console.log("New article suggestion:", data.suggestion)
        setArticleSuggestion(data.suggestion)
      }

      return false
    } catch (error) {
      console.error("Error checking knowledge base:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      toast({
        title: "Knowledge Base Error",
        description: error instanceof Error ? error.message : "Failed to check knowledge base",
        variant: "destructive",
      })

      // Return false to allow the conversation to continue
      return false
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language)
    // Translate existing messages
    const translatedMessages = await Promise.all(
      messages.map(async (message) => ({
        ...message,
        content: message.sender === "user" ? message.content : await translate(message.content, language),
      })),
    )
    setMessages(translatedMessages)
  }

  const handleAddToKnowledgeBase = async () => {
    if (!articleSuggestion) return

    try {
      await onAddKnowledgeArticle({
        title: articleSuggestion.title,
        content: articleSuggestion.content,
        category: articleSuggestion.category,
        tags: articleSuggestion.tags,
        author: "AI Assistant",
        attachments: [],
      })

      toast({
        title: "Article added to knowledge base",
        description: "The article has been successfully added to the knowledge base.",
      })

      setArticleSuggestion(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add article to knowledge base.",
        variant: "destructive",
      })
    }
  }

  // Update the sendMessage function
  const sendMessage = async () => {
    if (!input.trim()) return

    setIsAILoading(true)
    const userMessage: Message = { content: input, sender: "user" }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")

    try {
      let foundInKnowledgeBase = false
      let knowledgeBaseError = false

      try {
        foundInKnowledgeBase = await checkKnowledgeBase(input)
      } catch (error) {
        console.warn("Knowledge base check failed:", error)
        knowledgeBaseError = true
      }

      let botResponse = ""
      if (foundInKnowledgeBase && relatedArticles.length > 0) {
        // Format response with existing articles
        botResponse = `I found some relevant information in our knowledge base:\n\n${relatedArticles
          .map((article) => `📚 ${article.title}\n${article.content}\n`)
          .join("\n")}\n\nWould you like me to provide more specific information about any of these topics?`
      } else {
        // If knowledge base check failed or found nothing, proceed with normal response
        if (knowledgeBaseError) {
          console.log("Falling back to standard response due to knowledge base error")
        }

        // Proceed with normal AI response
        // Search knowledge base for relevant articles
        let knowledgeArticles = []
        try {
          knowledgeArticles = await searchKnowledgeBase(input)

          // Log found articles for debugging
          if (knowledgeArticles.length > 0) {
            console.log(`Found ${knowledgeArticles.length} relevant articles`)
          }
        } catch (error) {
          console.warn("Knowledge base search failed:", error)
        }

        // Get bot response
        let botResponseKey = "default"
        try {
          // Check knowledge base categories first
          const lowerInput = input.toLowerCase()
          if (lowerInput.includes("password") || lowerInput.includes("login")) {
            botResponseKey = "password_reset"
          } else if (lowerInput.includes("printer")) {
            botResponseKey = "printer_issues"
          } else if (lowerInput.includes("vpn")) {
            botResponseKey = "vpn_connection"
          } else {
            // Fall back to intent matching
            const matchedKey = Object.keys(botResponses).find((key) =>
              botResponses[key].intents?.some((intent: string) => lowerInput.includes(intent.toLowerCase())),
            )
            if (matchedKey) {
              botResponseKey = matchedKey
            }
          }
        } catch (error) {
          console.warn("Intent matching failed:", error)
        }

        const botResponseObj = botResponses[botResponseKey]
        if (!botResponseObj) {
          throw new Error("Bot response not found")
        }

        let translatedContent = botResponseObj.content
        try {
          translatedContent = await translate(botResponseObj.content, selectedLanguage)
        } catch (error) {
          console.warn("Translation failed:", error)
        }

        // Enhance response with knowledge base articles
        const enhancedContent =
          knowledgeArticles.length > 0
            ? enhanceResponseWithKnowledge(translatedContent, knowledgeArticles)
            : translatedContent

        botResponse = enhancedContent
      }

      const botMessage: Message = {
        content:
          botResponse || "I apologize, but I'm having trouble accessing the knowledge base. How else can I help you?",
        sender: "bot",
        category: "general",
      }

      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error processing message:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      const errorMessage: Message = {
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        sender: "bot",
        category: "error",
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsAILoading(false)
    }
  }

  const handleQuickAccess = async (optionValue: string) => {
    const selectedOption = botResponses[optionValue]

    if (selectedOption) {
      setIsAILoading(true)
      const userMessage: Message = {
        content: quickAccessOptions.find((opt) => opt.value === optionValue)?.label || "",
        sender: "user",
      }
      setMessages((prevMessages) => [...prevMessages, userMessage])

      const translatedContent = await translate(selectedOption.content, selectedLanguage)

      setTimeout(() => {
        const botMessage: Message = {
          content: translatedContent,
          sender: "bot",
          category: selectedOption.category,
        }
        setMessages((prevMessages) => [...prevMessages, botMessage])
        setIsAILoading(false)
      }, 500)
    }
  }

  const handleCreateTicket = async () => {
    setIsCreatingTicket(true)
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a ticket.",
      })
      setIsCreatingTicket(false)
      return
    }

    try {
      const ticket = await createTicket(user.id, messages)
      toast({
        title: "Ticket Created",
        description: `Ticket #${ticket.id} has been created.`,
      })
      setMessages([]) // Clear messages after creating ticket
    } catch (error) {
      toast({
        title: "Error Creating Ticket",
        description: "Failed to create ticket. Please try again.",
      })
    } finally {
      setIsCreatingTicket(false)
    }
  }

  const handleFeedback = (question: string, answer: string) => {
    setFeedbackQuestion(question)
    setFeedbackAnswer(answer)
    setIsFeedbackModalOpen(true)
  }

  const submitFeedback = async () => {
    await updateBotKnowledge(feedbackQuestion, feedbackAnswer, isPositiveFeedback)
    setIsFeedbackModalOpen(false)
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    })
  }

  const handleNewServiceRequest = async (formData: any) => {
    try {
      const newTicket = await onCreateTicket(formData)
      // Add the ticket to the chat context
      setMessages((prev) => [
        ...prev,
        {
          content: `Ticket #${newTicket.id} has been created successfully.`,
          sender: "bot",
        },
      ])
    } catch (error) {
      // Error is already handled by parent component
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, there was an error creating your ticket. Please try again.",
          sender: "bot",
        },
      ])
    }
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>IT Service Desk Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4" ref={chatContainerRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-end gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={message.sender === "user" ? "/placeholder.svg" : "/placeholder.svg"}
                        alt={message.sender}
                      />
                      <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                      {message.sender === "bot" && (
                        <div className="flex justify-end mt-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleFeedback(message.content, message.content)}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Helpful</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleFeedback(message.content, message.content)}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Not helpful</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isAILoading && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2 flex-row">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">Thinking...</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex space-x-2">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language">
                    {supportedLanguages.find((lang) => lang.value === selectedLanguage)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                defaultValue=""
                onValueChange={(value) => {
                  if (value) {
                    handleQuickAccess(value)
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Quick access" />
                </SelectTrigger>
                <SelectContent>
                  {quickAccessOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message... (I'll check our knowledge base to help you)"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                className="flex-grow"
                aria-label="Message input with knowledge base integration"
              />
              <Button type="submit" onClick={sendMessage} disabled={isAILoading || !input.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserIcon className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Service Request</DialogTitle>
                  <DialogDescription>Fill out the form to create a new service request.</DialogDescription>
                </DialogHeader>
                <ServiceRequestForm
                  onSubmit={handleNewServiceRequest}
                  teams={teams}
                  users={users}
                  categories={categories}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>

        <Dialog open={isFeedbackModalOpen} onOpenChange={() => setIsFeedbackModalOpen(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Feedback</DialogTitle>
              <DialogDescription>Was this response helpful?</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => setIsPositiveFeedback(true)}>
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Yes
                </Button>
                <Button variant="outline" onClick={() => setIsPositiveFeedback(false)}>
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  No
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={submitFeedback}>
                Submit Feedback
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      <Dialog open={!!articleSuggestion} onOpenChange={() => setArticleSuggestion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Knowledge Base?</DialogTitle>
            <DialogDescription>
              I've identified information that could be helpful for other users. Would you like to add it to the
              knowledge base?
            </DialogDescription>
          </DialogHeader>
          {articleSuggestion && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Title</h3>
                <p>{articleSuggestion.title}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Content</h3>
                <p className="whitespace-pre-wrap">{articleSuggestion.content}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Category</h3>
                <p>{articleSuggestion.category}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Tags</h3>
                <p>{articleSuggestion.tags}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setArticleSuggestion(null)}>
              Cancel
            </Button>
            <Button onClick={handleAddToKnowledgeBase}>Add to Knowledge Base</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

