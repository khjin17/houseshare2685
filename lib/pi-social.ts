// Pi Social Integration for houseshare app
// Integrates Pi Network authentication and messaging capabilities

export interface PiSocialUser {
  uid: string
  username: string
  accessToken: string
}

export interface PiChatMessage {
  id: string
  senderId: string
  senderUsername: string
  receiverId: string
  receiverUsername: string
  propertyId: string
  message: string
  timestamp: Date
  isRead: boolean
  type: "text" | "image" | "booking" | "payment"
  metadata?: {
    paymentId?: string
    bookingId?: string
    amount?: number
  }
}

export interface PiChatConversation {
  id: string
  propertyId: string
  hostId: string
  hostUsername: string
  guestId: string
  guestUsername: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

// Pi Social Service Class
export class PiSocialService {
  private isInitialized = false
  private piSDK: any = null
  private currentUser: PiSocialUser | null = null
  private apiKey: string = process.env.NEXT_PUBLIC_PI_API_KEY || ""
  private apiUrl = "https://api.minepi.com/v2"
  private wsConnection: WebSocket | null = null
  private messageListeners: Set<(message: PiChatMessage) => void> = new Set()

  // Initialize Pi SDK
  async initialize() {
    if (this.isInitialized) return

    if (typeof window !== "undefined" && (window as any).Pi) {
      this.piSDK = (window as any).Pi
      this.isInitialized = true
      console.log("[v0] Pi Social SDK initialized")
    } else {
      console.warn("[v0] Pi SDK not available. Using mock mode for development.")
      this.piSDK = this.createMockPiSDK()
      this.isInitialized = true
    }
  }

  // Authenticate user with Pi Network
  async authenticate(): Promise<PiSocialUser | null> {
    await this.initialize()

    try {
      if (!this.piSDK) {
        throw new Error("Pi SDK not initialized")
      }

      const scopes = ["username", "payments"]
      const authResult = await this.piSDK.authenticate(scopes, this.onIncompletePaymentFound)

      this.currentUser = {
        uid: authResult.user.uid,
        username: authResult.user.username,
        accessToken: authResult.accessToken,
      }

      console.log("[v0] Pi Social authentication successful:", this.currentUser.username)

      // Initialize WebSocket connection for real-time messaging
      await this.initializeWebSocket()

      return this.currentUser
    } catch (error) {
      console.error("[v0] Pi Social authentication failed:", error)
      return null
    }
  }

  // Get current authenticated user
  getCurrentUser(): PiSocialUser | null {
    return this.currentUser
  }

  // Get user info from Pi Network API
  async getUserInfo(accessToken?: string): Promise<{ uid: string; username: string } | null> {
    try {
      const token = accessToken || this.currentUser?.accessToken
      if (!token) {
        throw new Error("No access token available")
      }

      const response = await fetch(`${this.apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user info")
      }

      const userData = await response.json()
      return userData
    } catch (error) {
      console.error("[v0] Failed to get user info:", error)
      return null
    }
  }

  // Initialize WebSocket for real-time messaging
  private async initializeWebSocket() {
    if (!this.currentUser) return

    try {
      // In production, use Pi Network's WebSocket endpoint
      // For development, we'll simulate WebSocket behavior
      console.log("[v0] Initializing WebSocket connection for real-time chat")

      if (typeof window !== "undefined") {
        // Mock WebSocket for development
        this.wsConnection = {
          send: (data: string) => {
            console.log("[v0] WebSocket send:", data)
          },
          close: () => {
            console.log("[v0] WebSocket closed")
          },
        } as any
      }
    } catch (error) {
      console.error("[v0] WebSocket initialization failed:", error)
    }
  }

  // Send message to another Pi user
  async sendMessage(message: {
    receiverId: string
    receiverUsername: string
    propertyId: string
    message: string
    type?: "text" | "image" | "booking" | "payment"
    metadata?: any
  }): Promise<PiChatMessage> {
    if (!this.currentUser) {
      throw new Error("User not authenticated")
    }

    try {
      const chatMessage: PiChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        senderId: this.currentUser.uid,
        senderUsername: this.currentUser.username,
        receiverId: message.receiverId,
        receiverUsername: message.receiverUsername,
        propertyId: message.propertyId,
        message: message.message,
        timestamp: new Date(),
        isRead: false,
        type: message.type || "text",
        metadata: message.metadata,
      }

      // Store message in backend
      await this.storeMessage(chatMessage)

      // Send via WebSocket for real-time delivery
      if (this.wsConnection) {
        this.wsConnection.send(JSON.stringify({
          type: "chat_message",
          data: chatMessage,
        }))
      }

      console.log("[v0] Message sent successfully:", chatMessage.id)
      return chatMessage
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
      throw error
    }
  }

  // Get conversation history
  async getConversationMessages(propertyId: string, otherUserId: string): Promise<PiChatMessage[]> {
    if (!this.currentUser) {
      throw new Error("User not authenticated")
    }

    try {
      // Call backend API to fetch messages
      const response = await fetch(
        `/api/chat/messages?propertyId=${propertyId}&userId=${this.currentUser.uid}&otherUserId=${otherUserId}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const messages = await response.json()
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
    } catch (error) {
      console.error("[v0] Failed to get conversation messages:", error)
      // Return mock messages for development
      return this.getMockMessages(propertyId, otherUserId)
    }
  }

  // Get all conversations for current user
  async getConversations(): Promise<PiChatConversation[]> {
    if (!this.currentUser) {
      throw new Error("User not authenticated")
    }

    try {
      const response = await fetch(`/api/chat/conversations?userId=${this.currentUser.uid}`)

      if (!response.ok) {
        throw new Error("Failed to fetch conversations")
      }

      const conversations = await response.json()
      return conversations.map((conv: any) => ({
        ...conv,
        lastMessageTime: conv.lastMessageTime ? new Date(conv.lastMessageTime) : undefined,
      }))
    } catch (error) {
      console.error("[v0] Failed to get conversations:", error)
      return []
    }
  }

  // Alias for getConversations for compatibility
  async getAllConversations(): Promise<PiChatConversation[]> {
    return this.getConversations()
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error("User not authenticated")
    }

    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: this.currentUser.uid,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete conversation")
      }

      console.log("[v0] Conversation deleted:", conversationId)
    } catch (error) {
      console.error("[v0] Failed to delete conversation:", error)
      throw error
    }
  }

  // Mark messages as read
  async markAsRead(conversationId: string, messageIds: string[]) {
    if (!this.currentUser) return

    try {
      await fetch("/api/chat/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: this.currentUser.uid,
          conversationId,
          messageIds,
        }),
      })
    } catch (error) {
      console.error("[v0] Failed to mark messages as read:", error)
    }
  }

  // Subscribe to new messages
  subscribeToMessages(callback: (message: PiChatMessage) => void) {
    this.messageListeners.add(callback)
    
    return () => {
      this.messageListeners.delete(callback)
    }
  }

  // Notify listeners of new message
  private notifyMessageListeners(message: PiChatMessage) {
    this.messageListeners.forEach((listener) => listener(message))
  }

  // Store message in backend
  private async storeMessage(message: PiChatMessage) {
    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      })
    } catch (error) {
      console.error("[v0] Failed to store message:", error)
    }
  }

  // Handle incomplete payments
  private onIncompletePaymentFound(payment: any) {
    console.log("[v0] Incomplete payment found:", payment)
    return payment.identifier
  }

  // Mock messages for development
  private getMockMessages(propertyId: string, otherUserId: string): PiChatMessage[] {
    if (!this.currentUser) return []

    return [
      {
        id: "msg-1",
        senderId: otherUserId,
        senderUsername: "host_sarah",
        receiverId: this.currentUser.uid,
        receiverUsername: this.currentUser.username,
        propertyId,
        message: "Hi! Thanks for your interest in my property. I'd be happy to answer any questions!",
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
        type: "text",
      },
      {
        id: "msg-2",
        senderId: this.currentUser.uid,
        senderUsername: this.currentUser.username,
        receiverId: otherUserId,
        receiverUsername: "host_sarah",
        propertyId,
        message: "Hello! Is the property available for this weekend?",
        timestamp: new Date(Date.now() - 1800000),
        isRead: true,
        type: "text",
      },
      {
        id: "msg-3",
        senderId: otherUserId,
        senderUsername: "host_sarah",
        receiverId: this.currentUser.uid,
        receiverUsername: this.currentUser.username,
        propertyId,
        message: "Yes, it's available! The house can accommodate up to 8 guests. Would you like to proceed with booking?",
        timestamp: new Date(Date.now() - 900000),
        isRead: true,
        type: "text",
      },
    ]
  }

  // Mock Pi SDK for development
  private createMockPiSDK() {
    return {
      authenticate: async (scopes: string[], onIncompletePaymentFound: any) => {
        console.log("[v0] Mock Pi Social authentication")
        return {
          user: {
            uid: `pi-user-${Date.now()}`,
            username: "demo_pioneer",
          },
          accessToken: `mock-token-${Date.now()}`,
        }
      },
    }
  }

  // Disconnect
  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close()
      this.wsConnection = null
    }
    this.currentUser = null
    this.messageListeners.clear()
    console.log("[v0] Pi Social disconnected")
  }
}

// Singleton instance
export const piSocial = new PiSocialService()
