"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, FileText, Calendar, User, Paperclip } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

interface Article {
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

// Update mock data to match new interface
const mockArticles: Article[] = [
  {
    id: 1,
    title: "How to reset your password",
    content: "To reset your password, follow these steps...",
    category: "account",
    tags: "password,security,access",
    author: "John Doe",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
    attachments: [],
  },
  {
    id: 2,
    title: "Troubleshooting network issues",
    content: "If you're experiencing network issues, try the following...",
    category: "network",
    tags: "network,connectivity,troubleshooting",
    author: "Jane Smith",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-18"),
    attachments: [],
  },
]

const initialArticleState = {
  title: "",
  content: "",
  category: "account",
  tags: "",
  author: "Current User", // This would normally come from auth context
  createdAt: new Date(),
  updatedAt: new Date(),
  attachments: [],
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("relevance")
  const [newArticle, setNewArticle] = useState(initialArticleState)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const { toast } = useToast()

  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "recent":
          return b.updatedAt.getTime() - a.updatedAt.getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles: Attachment[] = []
    let hasError = false

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB limit`,
          variant: "destructive",
        })
        hasError = true
        return
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        })
        hasError = true
        return
      }

      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })
    })

    if (!hasError) {
      setNewArticle((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }))
    }
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setNewArticle((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }))
  }

  const handleAddArticle = () => {
    const articleToAdd: Article = {
      ...newArticle,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setArticles([...articles, articleToAdd])
    setNewArticle(initialArticleState)
    toast({
      title: "Article added",
      description: "The article has been successfully created.",
    })
  }

  const handleDeleteArticle = (article: Article) => {
    setArticles(articles.filter((a) => a.id !== article.id))
    setArticleToDelete(null)
    toast({
      title: "Article deleted",
      description: "The article has been successfully deleted.",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            className="w-full sm:w-[300px]"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="account">Account & Access</SelectItem>
              <SelectItem value="hardware">Hardware & Printers</SelectItem>
              <SelectItem value="software">Software & Applications</SelectItem>
              <SelectItem value="network">Network & VPN</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
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
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newArticle.category}
                  onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account & Access</SelectItem>
                    <SelectItem value="hardware">Hardware & Printers</SelectItem>
                    <SelectItem value="software">Software & Applications</SelectItem>
                    <SelectItem value="network">Network & VPN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="col-span-3 min-h-[200px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  value={newArticle.tags}
                  onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attachments" className="text-right">
                  Attachments
                </Label>
                <div className="col-span-3 space-y-4">
                  <Input
                    id="attachments"
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    accept={ALLOWED_FILE_TYPES.join(",")}
                  />
                  <div className="space-y-2">
                    {newArticle.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                          <span className="text-sm text-muted-foreground">({formatFileSize(file.size)})</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveAttachment(file.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddArticle}>Add Article</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{article.category}</Badge>
                {article.tags.split(",").map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{article.content.substring(0, 100)}...</CardDescription>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Updated {format(article.updatedAt, "MMM d, yyyy")}
                </div>
                {article.attachments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    {article.attachments.length} attachment(s)
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Read More</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{article.title}</DialogTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      {article.tags.split(",").map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      {article.content.split("\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    {article.attachments.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Attachments</h3>
                        <div className="space-y-2">
                          {article.attachments.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {file.name}
                                </a>
                                <span className="text-sm text-muted-foreground">({formatFileSize(file.size)})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Author: {article.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Created: {format(article.createdAt, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Last updated: {format(article.updatedAt, "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={() => setArticleToDelete(article)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the article "{articleToDelete?.title}" and
              remove it from the knowledge base.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => articleToDelete && handleDeleteArticle(articleToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

