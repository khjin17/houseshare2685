// SNS Integration utilities for houseshare app
export interface SNSUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  propertyId: string
  message: string
  timestamp: Date
  isRead: boolean
  type: "text" | "image" | "booking"
}

export interface PropertyHost {
  id: string
  name: string
  avatar?: string
  rating: number
  responseTime: string
  isVerified: boolean
  isOnline: boolean
}

// Mock SNS API functions
export const snsApi = {
  // Get current user from SNS
  getCurrentUser: async (): Promise<SNSUser | null> => {
    // Mock implementation - replace with actual SNS API
    return {
      id: "user-123",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    }
  },

  // Get host information
  getHostInfo: async (hostId: string): Promise<PropertyHost> => {
    // Mock implementation
    return {
      id: hostId,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      responseTime: "Usually responds within 1 hour",
      isVerified: true,
      isOnline: true,
    }
  },

  // Send message to host
  sendMessage: async (message: Omit<ChatMessage, "id" | "timestamp" | "isRead">): Promise<ChatMessage> => {
    // Mock implementation
    return {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
      isRead: false,
    }
  },

  // Get chat messages for a property
  getChatMessages: async (propertyId: string, userId: string): Promise<ChatMessage[]> => {
    // Mock implementation
    return [
      {
        id: "msg-1",
        senderId: "host-456",
        receiverId: userId,
        propertyId,
        message: "Hi! Thanks for your interest in my property. I'd be happy to answer any questions!",
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
        type: "text",
      },
      {
        id: "msg-2",
        senderId: userId,
        receiverId: "host-456",
        propertyId,
        message: "Hello! Is the property available for this weekend?",
        timestamp: new Date(Date.now() - 1800000),
        isRead: true,
        type: "text",
      },
    ]
  },
}
