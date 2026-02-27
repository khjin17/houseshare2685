import { NextRequest, NextResponse } from "next/server"

// In-memory storage for development (replace with database in production)
const messages: any[] = []

export async function POST(request: NextRequest) {
  try {
    const message = await request.json()

    // Validate message data
    if (!message.senderId || !message.receiverId || !message.message) {
      return NextResponse.json({ error: "Invalid message data" }, { status: 400 })
    }

    // Store message (in production, store in database)
    messages.push({
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
    })

    console.log("[v0] Message stored:", message.id)

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("[v0] Failed to store message:", error)
    return NextResponse.json({ error: "Failed to store message" }, { status: 500 })
  }
}
