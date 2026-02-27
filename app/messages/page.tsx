"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, MessageCircle, Loader2 } from "lucide-react"
import { piSocial, type PiChatConversation } from "@/lib/pi-social"
import { ChatWindow } from "@/components/chat-window"
import { useRouter } from "next/navigation"

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<PiChatConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    conversationId: string
    conversationTitle: string
  }>({
    isOpen: false,
    conversationId: "",
    conversationTitle: "",
  })
  const [chatState, setChatState] = useState<{
    isOpen: boolean
    propertyId: string
    hostId: string
    propertyTitle: string
  }>({
    isOpen: false,
    propertyId: "",
    hostId: "",
    propertyTitle: "",
  })

  const currentUser = piSocial.getCurrentUser()

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    setIsLoading(true)
    setIsAuthenticating(true)

    try {
      // Authenticate with Pi Network if not already authenticated
      let user = piSocial.getCurrentUser()
      if (!user) {
        console.log("[v0] Authenticating with Pi Network for messages...")
        user = await piSocial.authenticate()
        if (!user) {
          throw new Error("Authentication failed")
        }
      }

      setIsAuthenticated(true)

      // Get all conversations
      const convos = await piSocial.getAllConversations()
      setConversations(convos)

      console.log("[v0] Loaded conversations:", convos.length)
    } catch (error) {
      console.error("[v0] Failed to load conversations:", error)
    } finally {
      setIsLoading(false)
      setIsAuthenticating(false)
    }
  }

  const handleDeleteClick = (conversationId: string, hostUsername: string) => {
    setDeleteDialog({
      isOpen: true,
      conversationId,
      conversationTitle: hostUsername,
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      await piSocial.deleteConversation(deleteDialog.conversationId)
      setConversations((prev) => prev.filter((c) => c.id !== deleteDialog.conversationId))
      console.log("[v0] Conversation deleted:", deleteDialog.conversationId)
    } catch (error) {
      console.error("[v0] Failed to delete conversation:", error)
    } finally {
      setDeleteDialog({ isOpen: false, conversationId: "", conversationTitle: "" })
    }
  }

  const handleConversationClick = (propertyId: string, hostId: string, hostUsername: string) => {
    setChatState({
      isOpen: true,
      propertyId,
      hostId,
      propertyTitle: `Chat with ${hostUsername}`,
    })
  }

  const handleChatClose = () => {
    setChatState((prev) => ({ ...prev, isOpen: false }))
    // Refresh conversations after closing chat
    loadConversations()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BackButton title="Messages" />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isAuthenticating ? "Connecting to Pi Network..." : "Loading messages..."}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <BackButton title="Messages" />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] gap-3 px-4">
          <MessageCircle className="h-16 w-16 text-muted-foreground" />
          <h2 className="font-heading font-bold text-xl text-center">Connect to Pi Network</h2>
          <p className="text-sm text-muted-foreground text-center">
            Authenticate with Pi Network to view and manage your messages
          </p>
          <Button onClick={loadConversations} className="mt-4">
            Connect Pi Network
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="Messages" />

      <main className="px-4 py-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-3">
            <MessageCircle className="h-16 w-16 text-muted-foreground" />
            <h2 className="font-heading font-bold text-xl text-center">No Messages Yet</h2>
            <p className="text-sm text-muted-foreground text-center">
              Start chatting with hosts when you book a property
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => {
              const otherUser =
                currentUser?.uid === conversation.hostId
                  ? { id: conversation.guestId, username: conversation.guestUsername }
                  : { id: conversation.hostId, username: conversation.hostUsername }

              return (
                <div
                  key={conversation.id}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors"
                >
                  <button
                    onClick={() =>
                      handleConversationClick(conversation.propertyId, otherUser.id, otherUser.username)
                    }
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.username}`} />
                      <AvatarFallback>{otherUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{otherUser.username}</h3>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                      {conversation.lastMessageTime && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conversation.lastMessageTime).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(conversation.id, otherUser.username)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ ...deleteDialog, isOpen: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation with {deleteDialog.conversationTitle}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Chat Window */}
      <ChatWindow
        propertyId={chatState.propertyId}
        hostId={chatState.hostId}
        propertyTitle={chatState.propertyTitle}
        isOpen={chatState.isOpen}
        onClose={handleChatClose}
      />
    </div>
  )
}
