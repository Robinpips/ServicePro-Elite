import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data for knowledge base articles
const mockArticles = [
  { id: 1, title: "How to reset your password", content: "To reset your password, follow these steps..." },
  { id: 2, title: "Troubleshooting network issues", content: "If you're experiencing network issues, try the following..." },
  { id: 3, title: "Setting up your email client", content: "To set up your email client, you'll need the following information..." },
]

export function KnowledgeBase() {
  const [articles, setArticles] = useState(mockArticles)
  const [searchTerm, setSearchTerm] = useState('')
  const [newArticle, setNewArticle] = useState({ title: '', content: '' })

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddArticle = () => {
    setArticles([...articles, { ...newArticle, id: Date.now() }])
    setNewArticle({ title: '', content: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          className="w-full sm:max-w-sm"
          placeholder="Search knowledge base..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Add Article</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
              <DialogDescription>Create a new knowledge base article.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddArticle}>Add Article</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{article.content.substring(0, 100)}...</CardDescription>
              <Button className="mt-4" variant="outline">Read More</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

