"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Send, Phone, Video, Info, Loader2, ArrowLeft, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { piSocial, type PiChatMessage } from "@/lib/pi-social"
import { snsApi, type PropertyHost } from "@/lib/sns-integration"
import { translationService, type SupportedLanguage, languageNames } from "@/lib/translation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatWindowProps {
  propertyId: string
  hostId: string
  propertyTitle: string
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ propertyId, hostId, propertyTitle, isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<PiChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [host, setHost] = useState<PropertyHost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>("ko")
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUser = piSocial.getCurrentUser()

  useEffect(() => {
    if (isOpen) {
      authenticateAndLoadChat()
    }
  }, [isOpen, propertyId, hostId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      // Subscribe to real-time messages
      const unsubscribe = piSocial.subscribeToMessages((message) => {
        if (message.propertyId === propertyId) {
          setMessages((prev) => [...prev, message])
          // Auto-translate incoming messages from other users
          if (autoTranslate && message.senderId !== currentUser?.uid) {
            translateMessage(message.id, message.message)
          }
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [isOpen, isAuthenticated, propertyId, autoTranslate])

  useEffect(() => {
    // Auto-translate all existing messages when auto-translate is enabled
    if (autoTranslate) {
      messages.forEach((message) => {
        if (message.senderId !== currentUser?.uid && !translations[message.id]) {
          translateMessage(message.id, message.message)
        }
      })
    }
  }, [autoTranslate, targetLanguage])

  const authenticateAndLoadChat = async () => {
    setIsLoading(true)
    setIsAuthenticating(true)

    try {
      // Authenticate with Pi Network if not already authenticated
      let user = piSocial.getCurrentUser()
      if (!user) {
        console.log("[v0] Authenticating with Pi Network...")
        user = await piSocial.authenticate()
        if (!user) {
          throw new Error("Authentication failed")
        }
      }

      setIsAuthenticated(true)

      // Load host info and messages
      const [hostInfo, chatMessages] = await Promise.all([
        snsApi.getHostInfo(hostId),
        piSocial.getConversationMessages(propertyId, hostId),
      ])

      setHost(hostInfo)
      setMessages(chatMessages)
      
      console.log("[v0] Chat loaded with Pi Social integration")
    } catch (error) {
      console.error("[v0] Failed to load chat data:", error)
    } finally {
      setIsLoading(false)
      setIsAuthenticating(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const translateMessage = async (messageId: string, text: string) => {
    try {
      const result = await translationService.translate(text, targetLanguage)
      setTranslations((prev) => ({
        ...prev,
        [messageId]: result.translatedText,
      }))
    } catch (error) {
      console.error("[v0] Translation error:", error)
    }
  }

  const toggleShowOriginal = (messageId: string) => {
    setShowOriginal((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !host || !currentUser || isSending) return

    setIsSending(true)

    try {
      const sentMessage = await piSocial.sendMessage({
        receiverId: hostId,
        receiverUsername: host.name,
        propertyId,
        message: newMessage.trim(),
        type: "text",
      })

      setMessages((prev) => [...prev, sentMessage])
      setNewMessage("")
      
      console.log("[v0] Message sent via Pi Social")
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
      <Card className="w-full h-full md:w-96 md:h-[600px] md:rounded-lg rounded-none flex flex-col">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {host && (
              <>
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={host.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {host.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm truncate">{host.name}</h3>
                    {host.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{propertyTitle}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Languages className={`h-4 w-4 ${autoTranslate ? "text-primary" : ""}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2 text-xs font-semibold">Auto Translate</div>
                <DropdownMenuItem onClick={() => setAutoTranslate(!autoTranslate)}>
                  {autoTranslate ? "Disable" : "Enable"} Auto Translation
                </DropdownMenuItem>
                {autoTranslate && (
                  <>
                    <div className="p-2 text-xs font-semibold border-t mt-1">Target Language</div>
                    {(Object.keys(languageNames) as SupportedLanguage[]).map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => setTargetLanguage(lang)}
                        className={targetLanguage === lang ? "bg-accent" : ""}
                      >
                        {languageNames[lang]}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-sm text-muted-foreground">
                {isAuthenticating ? "Connecting to Pi Network..." : "Loading messages..."}
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-sm text-muted-foreground text-center">Please authenticate with Pi Network to chat</p>
              <Button onClick={authenticateAndLoadChat} size="sm">
                Connect Pi Network
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  🔐 Secure messaging powered by Pi Network
                </p>
              </div>
              {messages.map((message) => {
                const isOwnMessage = message.senderId === currentUser?.uid
                const hasTranslation = !isOwnMessage && translations[message.id]
                const displayText = hasTranslation && !showOriginal[message.id] 
                  ? translations[message.id] 
                  : message.message

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {isOwnMessage ? "You" : message.senderUsername}
                      </p>
                      {hasTranslation && !showOriginal[message.id] && (
                        <Badge variant="secondary" className="text-xs mb-1">
                          Translated
                        </Badge>
                      )}
                      <p className="text-sm">{displayText}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {hasTranslation && (
                      <button
                        onClick={() => toggleShowOriginal(message.id)}
                        className="text-xs text-muted-foreground hover:underline mt-1"
                      >
                        {showOriginal[message.id] ? "Show Translation" : "Show Original"}
                      </button>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isAuthenticated ? "Type a message..." : "Connect to Pi Network to chat..."}
              className="flex-1"
              disabled={!isAuthenticated || isSending}
            />
            <Button onClick={handleSendMessage} size="icon" disabled={!isAuthenticated || isSending}>
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
