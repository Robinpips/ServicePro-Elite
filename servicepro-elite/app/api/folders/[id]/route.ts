import { NextResponse } from "next/server"
import type { FolderItem } from "@/types"

// Mock database - using the same reference as the main route
declare const folders: FolderItem[]

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json()
    const index = folders.findIndex((f) => f.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    folders[index] = { ...folders[index], ...updates }
    return NextResponse.json(folders[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update folder" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const index = folders.findIndex((f) => f.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    folders.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 })
  }
}

