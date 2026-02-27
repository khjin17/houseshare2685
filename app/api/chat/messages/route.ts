import { NextRequest, NextResponse } from "next/server"

// In-memory storage for development (replace with database in production)
const messages: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("propertyId")
    const userId = searchParams.get("userId")
    const otherUserId = searchParams.get("otherUserId")

    if (!propertyId || !userId || !otherUserId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Filter messages for this conversation
    const conversationMessages = messages.filter(
      (msg) =>
        msg.propertyId === propertyId &&
        ((msg.senderId === userId && msg.receiverId === otherUserId) ||
          (msg.senderId === otherUserId && msg.receiverId === userId))
    )

    // Sort by timestamp
    conversationMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return NextResponse.json(conversationMessages)
  } catch (error) {
    console.error("[v0] Failed to fetch messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
