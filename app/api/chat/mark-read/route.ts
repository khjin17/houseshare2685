import { NextRequest, NextResponse } from "next/server"

// In-memory storage for development (replace with database in production)
const messages: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { userId, conversationId, messageIds } = await request.json()

    if (!userId || !conversationId || !messageIds) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Mark messages as read
    messageIds.forEach((msgId: string) => {
      const message = messages.find((m) => m.id === msgId && m.receiverId === userId)
      if (message) {
        message.isRead = true
      }
    })

    console.log("[v0] Messages marked as read:", messageIds.length)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Failed to mark messages as read:", error)
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 })
  }
}
