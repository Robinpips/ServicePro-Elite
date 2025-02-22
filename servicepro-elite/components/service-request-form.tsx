"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Folder {
  id: string
  name: string
  type: "folder" | "project" | "task"
  parentId?: string | null
  children: string[]
}

interface Team {
  id: string
  name: string
}

interface User {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface ServiceRequestFormData {
  title: string
  description: string
  category: string
  priority: string
  assignedTo: string
  team: string
  folderId: string
}

interface ServiceRequestFormProps {
  onSubmit: (formData: ServiceRequestFormData) => Promise<any>
  teams: Team[]
  users: User[]
  categories: Category[]
  folders: Folder[]
  isLoading?: boolean
}

export function ServiceRequestForm({
  onSubmit,
  teams,
  users,
  categories,
  folders,
  isLoading,
}: ServiceRequestFormProps) {
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    title: "",
    description: "",
    category: "",
    priority: "",
    assignedTo: "",
    team: "",
    folderId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Recursive function to build folder options with proper indentation
  const buildFolderOptions = (folders: Folder[], parentId: string | null = null, level = 0): React.ReactNode[] => {
    return folders
      .filter((folder) => folder.parentId === parentId)
      .flatMap((folder) => {
        const indent = "—".repeat(level)
        const children = buildFolderOptions(folders, folder.id, level + 1)
        return [
          <SelectItem key={folder.id} value={folder.id}>
            {indent} {folder.name} ({folder.type})
          </SelectItem>,
          ...children,
        ]
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        assignedTo: "",
        team: "",
        folderId: "",
      })
      toast({
        title: "Success",
        description: "Service request created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="folder">Folder</Label>
        <Select
          name="folderId"
          value={formData.folderId}
          onValueChange={(value) => handleSelectChange("folderId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select folder" />
          </SelectTrigger>
          <SelectContent>{buildFolderOptions(folders)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          value={formData.category.toString()}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          name="priority"
          value={formData.priority}
          onValueChange={(value) => handleSelectChange("priority", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Select
          name="assignedTo"
          value={formData.assignedTo.toString()}
          onValueChange={(value) => handleSelectChange("assignedTo", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="team">Team</Label>
        <Select
          name="team"
          value={formData.team.toString()}
          onValueChange={(value) => handleSelectChange("team", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {teams?.map((team) => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Submit Request"}
      </Button>
    </form>
  )
}

