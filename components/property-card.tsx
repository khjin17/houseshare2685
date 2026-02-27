"use client"

import React, { memo } from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Heart, Star, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { favoritesManager } from "@/lib/favorites"
import Link from "next/link"
import { VerificationBadge } from "@/components/verification-badge"

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  isFavorite?: boolean
  hostId?: string
  onChatClick?: (propertyId: string, hostId: string, title: string) => void
  onBookClick?: (propertyId: string, hostId: string, title: string, price: number) => void
  onReviewsClick?: (propertyTitle: string, rating: number, reviews: number) => void
  onFavoriteChange?: () => void
  verificationLevel?: "basic" | "verified" | "premium"
  hasNFT?: boolean
}

const PropertyCardComponent = ({
  id,
  title,
  location,
  price,
  rating,
  reviews,
  image,
  isFavorite = false,
  hostId = "host-456",
  onChatClick,
  onBookClick,
  onReviewsClick,
  onFavoriteChange,
  verificationLevel = "basic",
  hasNFT = false,
}: PropertyCardProps) => {
  const [favorite, setFavorite] = useState(isFavorite)

  useEffect(() => {
    setFavorite(favoritesManager.isFavorite(id))
  }, [id])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newFavoriteState = favoritesManager.toggle({
      id,
      title,
      location,
      price,
      rating,
      reviews,
      image,
      hostId,
    })
    
    setFavorite(newFavoriteState)
    onFavoriteChange?.()
  }

  const handleRatingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onReviewsClick?.(title, rating, reviews)
  }

  return (
    <Link href={`/property/${id}`} className="block">
      <Card className="overflow-hidden hover-lift group border-2 border-transparent hover:border-primary/30 transition-all duration-300 cursor-pointer">
        <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          <Image 
            src={image || "/placeholder.svg"} 
            alt={title} 
            fill 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3 glass rounded-full backdrop-blur-md hover:scale-110 transition-transform z-10"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-primary text-primary" : "text-foreground"}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading font-semibold text-base leading-tight flex-1 line-clamp-2">{title}</h3>
            <VerificationBadge verificationLevel={verificationLevel} hasNFT={hasNFT} />
          </div>

          <div className="flex items-center text-muted-foreground mb-2 min-w-0">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          <button 
            onClick={handleRatingClick}
            className="flex items-center mb-3 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground ml-1">({reviews} reviews)</span>
          </button>

          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-heading font-bold whitespace-nowrap">π{price.toFixed(6)}</span>
                <span className="text-muted-foreground text-xs whitespace-nowrap">/ night</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onChatClick && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onChatClick(id, hostId, title)
                  }}
                  className="h-8 px-2 border-primary/30 hover:bg-primary/10 transition-colors z-10 relative"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                className="h-8 px-3 text-xs font-bold whitespace-nowrap gradient-secondary hover:opacity-90 transition-opacity border-0 shadow-lg glow-gold z-10 relative"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onBookClick?.(id, hostId, title, price)
                }}
              >
                Book
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export const PropertyCard = memo(PropertyCardComponent)

export default memo(PropertyCardComponent)
