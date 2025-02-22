import { NextResponse } from "next/server"
import type { FolderItem } from "@/types"

// Mock database
const folders: FolderItem[] = []

export async function GET() {
  return NextResponse.json(folders)
}

export async function POST(req: Request) {
  try {
    const newFolder: Omit<FolderItem, "id"> = await req.json()
    const folder: FolderItem = {
      ...newFolder,
      id: `folder-${Date.now()}`,
    }
    folders.push(folder)
    return NextResponse.json(folder)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
  }
}

