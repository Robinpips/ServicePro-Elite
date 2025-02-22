import type React from "react"
// Common interfaces used across components
export interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  teams?: number[]
}

export interface Team {
  id: number
  name: string
  members: number[]
}

export interface Category {
  id: number
  name: string
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: "open" | "in-progress" | "closed"
  priority: "low" | "medium" | "high"
  assignedTo: string
  team: string
  requester: string
  category: string
  folderId?: string
  scheduledDate?: Date
  createdAt: Date
  updatedAt: Date
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface Folder {
  id: string
  name: string
  type: "folder" | "project" | "task"
  parentId?: string | null
  children: string[]
  tickets: number[]
  icon?: React.ElementType
  color?: string
}

export interface Project extends Folder {
  type: "project"
  startDate?: string
  endDate?: string
  status: "not-started" | "in-progress" | "completed"
  owner?: string
  priority: "low" | "medium" | "high"
}

export interface Task extends Folder {
  type: "task"
  dueDate?: string
  assignee?: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  dependencies?: string[]
}

export type FolderItem = Folder | Project | Task

