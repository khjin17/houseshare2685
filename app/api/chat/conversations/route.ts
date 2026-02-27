import { NextRequest, NextResponse } from "next/server"

// In-memory storage for development (replace with database in production)
const messages: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    // Group messages by conversation (propertyId + other user)
    const conversationsMap = new Map()

    messages
      .filter((msg) => msg.senderId === userId || msg.receiverId === userId)
      .forEach((msg) => {
        const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId
        const conversationKey = `${msg.propertyId}-${otherUserId}`

        if (!conversationsMap.has(conversationKey)) {
          conversationsMap.set(conversationKey, {
            id: conversationKey,
            propertyId: msg.propertyId,
            hostId: msg.senderId === userId ? msg.receiverId : msg.senderId,
            hostUsername: msg.senderId === userId ? msg.receiverUsername : msg.senderUsername,
            guestId: userId,
            guestUsername: msg.senderId === userId ? msg.senderUsername : msg.receiverUsername,
            lastMessage: msg.message,
            lastMessageTime: msg.timestamp,
            unreadCount: 0,
            messages: [],
          })
        }

        const conversation = conversationsMap.get(conversationKey)
        conversation.messages.push(msg)

        // Update last message if this one is newer
        if (new Date(msg.timestamp) > new Date(conversation.lastMessageTime)) {
          conversation.lastMessage = msg.message
          conversation.lastMessageTime = msg.timestamp
        }

        // Count unread messages
        if (msg.receiverId === userId && !msg.isRead) {
          conversation.unreadCount++
        }
      })

    const conversations = Array.from(conversationsMap.values())

    // Sort by last message time
    conversations.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("[v0] Failed to fetch conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
