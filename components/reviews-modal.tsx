"use client"

import { useState } from "react"
import { X, Star, ThumbsUp, Languages, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { translationService, type SupportedLanguage, languageNames } from "@/lib/translation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  comment: string
  helpful: number
}

interface ReviewsModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
  averageRating: number
  totalReviews: number
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg",
    rating: 5,
    date: "2024-01-15",
    comment: "Amazing place! Very clean and exactly as described. The host was super responsive and helpful. Would definitely stay here again!",
    helpful: 12,
  },
  {
    id: "2",
    userName: "Michael Chen",
    userAvatar: "/placeholder.svg",
    rating: 4,
    date: "2024-01-10",
    comment: "Great location and comfortable space. Only minor issue was the Wi-Fi speed, but overall a wonderful experience.",
    helpful: 8,
  },
  {
    id: "3",
    userName: "Emma Davis",
    userAvatar: "/placeholder.svg",
    rating: 5,
    date: "2024-01-05",
    comment: "Perfect for our family trip! Spacious, well-equipped kitchen, and the kids loved it. Highly recommend!",
    helpful: 15,
  },
  {
    id: "4",
    userName: "David Park",
    userAvatar: "/placeholder.svg",
    rating: 4,
    date: "2023-12-28",
    comment: "Nice place in a quiet neighborhood. Check-in was smooth and the host provided great local recommendations.",
    helpful: 6,
  },
  {
    id: "5",
    userName: "Lisa Anderson",
    userAvatar: "/placeholder.svg",
    rating: 5,
    date: "2023-12-20",
    comment: "Absolutely loved this place! Beautiful decor, super comfortable bed, and the host thought of everything. Will be back!",
    helpful: 20,
  },
]

const ratingDistribution = [
  { stars: 5, count: 85, percentage: 70 },
  { stars: 4, count: 25, percentage: 20 },
  { stars: 3, count: 8, percentage: 7 },
  { stars: 2, count: 3, percentage: 2 },
  { stars: 1, count: 1, percentage: 1 },
]

export function ReviewsModal({ isOpen, onClose, propertyTitle, averageRating, totalReviews }: ReviewsModalProps) {
  const [translations, setTranslations] = useState<Record<string, { text: string; lang: SupportedLanguage }>>({})
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set())

  if (!isOpen) return null

  const handleTranslate = async (reviewId: string, originalText: string, targetLang: SupportedLanguage) => {
    setTranslatingIds((prev) => new Set(prev).add(reviewId))

    try {
      const result = await translationService.translate(originalText, targetLang)
      setTranslations((prev) => ({
        ...prev,
        [reviewId]: { text: result.translatedText, lang: targetLang },
      }))
      console.log("[v0] Review translated:", reviewId, targetLang)
    } catch (error) {
      console.error("[v0] Translation error:", error)
    } finally {
      setTranslatingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  const handleShowOriginal = (reviewId: string) => {
    setTranslations((prev) => {
      const newTranslations = { ...prev }
      delete newTranslations[reviewId]
      return newTranslations
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl">
        {/* Header */}
        <CardHeader className="border-b flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <h2 className="font-heading font-bold text-xl">Reviews</h2>
            <p className="text-sm text-muted-foreground mt-1">{propertyTitle}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Rating Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-heading font-bold">{averageRating}</div>
                <div className="flex items-center gap-1 mt-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{totalReviews} reviews</div>
              </div>

              <div className="flex-1 space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="text-sm w-8">{item.stars}★</span>
                    <Progress value={item.percentage} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {mockReviews.map((review) => {
              const isTranslating = translatingIds.has(review.id)
              const translation = translations[review.id]
              const displayText = translation ? translation.text : review.comment

              return (
                <div key={review.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{review.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                  </div>

                  {translation && (
                    <Badge variant="secondary" className="text-xs">
                      Translated to {languageNames[translation.lang]}
                    </Badge>
                  )}

                  <p className="text-sm leading-relaxed">{displayText}</p>

                  <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" size="sm" className="h-8 gap-2">
                      <ThumbsUp className="h-3 w-3" />
                      <span className="text-xs">Helpful ({review.helpful})</span>
                    </Button>

                    {translation ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2"
                        onClick={() => handleShowOriginal(review.id)}
                      >
                        <span className="text-xs">Show Original</span>
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 gap-2" disabled={isTranslating}>
                            {isTranslating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Languages className="h-3 w-3" />
                            )}
                            <span className="text-xs">Translate</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(Object.keys(languageNames) as SupportedLanguage[]).map((lang) => (
                            <DropdownMenuItem
                              key={lang}
                              onClick={() => handleTranslate(review.id, review.comment, lang)}
                            >
                              {languageNames[lang]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
