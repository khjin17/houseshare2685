"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { PropertyCard } from "@/components/property-card"
import { BottomNav } from "@/components/bottom-nav"
import { ChatWindow } from "@/components/chat-window"
import { BookingModal } from "@/components/booking-modal"
import { ReviewsModal } from "@/components/reviews-modal"
import { favoritesManager, type FavoriteProperty } from "@/lib/favorites"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
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

  const [bookingState, setBookingState] = useState<{
    isOpen: boolean
    property: {
      id: string
      title: string
      price: number
      hostId: string
    } | null
  }>({
    isOpen: false,
    property: null,
  })

  const [reviewsState, setReviewsState] = useState<{
    isOpen: boolean
    propertyTitle: string
    averageRating: number
    totalReviews: number
  }>({
    isOpen: false,
    propertyTitle: "",
    averageRating: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    const favs = favoritesManager.getAll()
    setFavorites(favs)
  }

  const handleChatClick = (propertyId: string, hostId: string, title: string) => {
    setChatState({
      isOpen: true,
      propertyId,
      hostId,
      propertyTitle: title,
    })
  }

  const handleChatClose = () => {
    setChatState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleBookClick = (propertyId: string, hostId: string, title: string, price: number) => {
    setBookingState({
      isOpen: true,
      property: {
        id: propertyId,
        title,
        price,
        hostId,
      },
    })
  }

  const handleBookingClose = () => {
    setBookingState({
      isOpen: false,
      property: null,
    })
  }

  const handleReviewsClick = (propertyTitle: string, rating: number, reviews: number) => {
    setReviewsState({
      isOpen: true,
      propertyTitle,
      averageRating: rating,
      totalReviews: reviews,
    })
  }

  const handleReviewsClose = () => {
    setReviewsState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="Favorites" />

      <main className="px-4 py-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-heading font-bold text-xl mb-2">No favorites yet</h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              Start exploring and add properties to your favorites by tapping the heart icon
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading font-semibold text-lg">
                {favorites.length} {favorites.length === 1 ? "Property" : "Properties"}
              </h2>
            </div>
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                isFavorite={true}
                onChatClick={handleChatClick}
                onBookClick={handleBookClick}
                onReviewsClick={handleReviewsClick}
                onFavoriteChange={loadFavorites}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />

      <ChatWindow
        propertyId={chatState.propertyId}
        hostId={chatState.hostId}
        propertyTitle={chatState.propertyTitle}
        isOpen={chatState.isOpen}
        onClose={handleChatClose}
      />

      {bookingState.property && (
        <BookingModal
          isOpen={bookingState.isOpen}
          onClose={handleBookingClose}
          property={bookingState.property}
        />
      )}

      <ReviewsModal
        isOpen={reviewsState.isOpen}
        onClose={handleReviewsClose}
        propertyTitle={reviewsState.propertyTitle}
        averageRating={reviewsState.averageRating}
        totalReviews={reviewsState.totalReviews}
      />
    </div>
  )
}
