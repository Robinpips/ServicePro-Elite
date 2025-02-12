'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'

export function AIAssistant() {
  const [context, setContext] = useState<string>('')
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: (message) => handleAIResponse(message.content),
  })
  const { toast } = useToast()
  const { addArticle } = useKnowledgeBase()

  const handleContextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContext(e.target.value)
  }

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e, { options: { context } })
  }

  const handleAIResponse = (response: string) => {
    // Check if the response contains new knowledge
    if (response.includes("[NEW KNOWLEDGE]")) {
      const newKnowledge = response.split("[NEW KNOWLEDGE]")[1].trim()
      const [title, content] = newKnowledge.split(":")
      
      // Add the new knowledge to the knowledge base
      addArticle({ title: title.trim(), content: content.trim() })
      
      toast({
        title: "New Knowledge Added",
        description: `A new article "${title.trim()}" has been added to the knowledge base.`,
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Ask me anything about your service desk!</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-end ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'} />
                  <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleMessageSubmit} className="w-full space-y-2">
          <Input
            placeholder="Add context (e.g., ticket ID, user info)"
            value={context}
            onChange={handleContextChange}
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={handleInputChange}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Thinking...' : 'Send'}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}

