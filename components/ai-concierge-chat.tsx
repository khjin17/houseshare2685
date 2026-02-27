"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AIConcierge, type VoiceCommand } from "@/lib/ai-concierge"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  intent?: VoiceCommand["intent"]
}

export function AIConciergeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "Hello! I'm your AI party concierge. I can help you find the perfect property for your event, suggest party packages, or answer any questions. What are you planning?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Process with AI
      const result = await AIConcierge.processVoiceCommand(input)

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: result.response,
        timestamp: new Date(),
        intent: result.intent,
      }

      setMessages((prev) => [...prev, aiMessage])

      // If search intent, add follow-up
      if (result.intent === "search") {
        setTimeout(() => {
          const followUp: Message = {
            id: `ai-followup-${Date.now()}`,
            type: "ai",
            content:
              "I found several great options for you! Would you like me to show properties by location, price range, or party size?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, followUp])
        }, 1000)
      }
    } catch (error) {
      console.error("[v0] AI concierge error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "ai",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser")
      return
    }

    setIsListening(true)

    try {
      // Simulate voice recognition (in production, use Web Speech API)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      const mockVoiceInput = "Find me a property for a party with 20 people"
      setInput(mockVoiceInput)
      setIsListening(false)
      
      setTimeout(() => handleSend(), 500)
    } catch (error) {
      console.error("[v0] Voice input error:", error)
      setIsListening(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Party Concierge
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.intent && (
                <Badge variant="secondary" className="text-xs mb-2">
                  {message.intent}
                </Badge>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            disabled={isListening || isProcessing}
          >
            <Mic className={`h-4 w-4 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isListening
                ? "Listening..."
                : "Ask me anything about properties, bookings, or parties..."
            }
            disabled={isProcessing || isListening}
          />
          <Button onClick={handleSend} disabled={isProcessing || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Find me a property for 20 people")}
          >
            Properties for 20
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Show me party packages")}
          >
            Party Packages
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("What's included in premium cleaning?")}
          >
            Cleaning Info
          </Button>
        </div>
      </div>
    </Card>
  )
}
