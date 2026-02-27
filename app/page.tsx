"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { PropertyCard } from "@/components/property-card"
import { BottomNav } from "@/components/bottom-nav"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPropertyImage } from "@/lib/placeholder-images"

// Dynamic imports for heavy components
const OnboardingModal = dynamic(() => import("@/components/onboarding-modal").then(mod => ({ default: mod.OnboardingModal })), { ssr: false })
const ChatWindow = dynamic(() => import("@/components/chat-window").then(mod => ({ default: mod.ChatWindow })), { ssr: false })
const BookingModal = dynamic(() => import("@/components/booking-modal").then(mod => ({ default: mod.BookingModal })), { ssr: false })
const ReviewsModal = dynamic(() => import("@/components/reviews-modal").then(mod => ({ default: mod.ReviewsModal })), { ssr: false })
const SideMenu = dynamic(() => import("@/components/side-menu").then(mod => ({ default: mod.SideMenu })), { ssr: false })
const PiCalculator = dynamic(() => import("@/components/pi-calculator").then(mod => ({ default: mod.PiCalculator })), { ssr: false })

const sampleProperties = [
  {
    id: "1",
    title: "Cozy Downtown Apartment",
    location: "San Francisco, CA",
    price: 0.000477,
    rating: 4.8,
    reviews: 124,
    image: getPropertyImage("1", 400, 300),
    verificationLevel: "premium" as const,
    hasNFT: true,
  },
  {
    id: "2",
    title: "Spacious Family Home",
    location: "Austin, TX",
    price: 0.0007,
    rating: 4.9,
    reviews: 89,
    image: getPropertyImage("2", 400, 300),
    verificationLevel: "verified" as const,
    hasNFT: false,
  },
  {
    id: "3",
    title: "Trendy Studio Loft",
    location: "Brooklyn, NY",
    price: 0.000573,
    rating: 4.7,
    reviews: 156,
    image: getPropertyImage("3", 400, 300),
    verificationLevel: "verified" as const,
    hasNFT: false,
  },
  {
    id: "4",
    title: "Beachfront Villa",
    location: "Miami, FL",
    price: 0.001114,
    rating: 4.9,
    reviews: 203,
    image: getPropertyImage("4", 400, 300),
    verificationLevel: "premium" as const,
    hasNFT: true,
  },
]

export default function HomePage() {
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

  const [menuOpen, setMenuOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)

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
    <>
      <OnboardingModal onComplete={() => setShowContent(true)} />
      
      {showContent && (
        <div className="min-h-screen bg-background pb-20">
          {/* Header */}
          <header className="bg-background border-b border-border sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>

              <h1 className="font-heading font-black text-xl text-primary">houseshare</h1>

              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <main className="px-4 py-6 space-y-6">
            {/* Welcome Section */}
            <div className="text-center space-y-3 py-4">
              <h2 className="font-heading font-bold text-3xl text-balance text-gradient-pi">Find Your Perfect Stay</h2>
              <p className="text-muted-foreground text-pretty text-base">Discover amazing houses powered by Pi Network</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass border border-primary/20">
                  <span className="text-primary font-bold">π</span>
                  <span className="text-muted-foreground">Crypto Payments</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass border border-secondary/20">
                  <span className="text-secondary font-bold">⚡</span>
                  <span className="text-muted-foreground">Instant Book</span>
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* Host CTA Banner */}
            <Link href="/become-host">
              <div className="glass border-2 border-primary/20 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] hover:glow-pi transition-all duration-300 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl gradient-accent flex items-center justify-center shrink-0 shadow-lg">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm sm:text-base mb-1 text-gradient-pi leading-tight">내 집으로 수익 만들기</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">1분 등록 · π0.000032</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-gradient-pi whitespace-nowrap">π0.089</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">월 평균</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Featured Properties */}
            <section className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Featured Properties</h3>
              <FeaturedCarousel />
            </section>

            {/* Popular Destinations */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg">Popular Near You</h3>
                <Link href="/search">
                  <Button variant="ghost" size="sm" className="text-primary bg-transparent">
                    See All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {sampleProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    {...property} 
                    onChatClick={handleChatClick}
                    onBookClick={handleBookClick}
                    onReviewsClick={handleReviewsClick}
                  />
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Browse by Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/search?category=house">
                  <div className="bg-card rounded-lg p-4 text-center border hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className="text-2xl mb-2">🏠</div>
                    <span className="font-medium">Entire House</span>
                  </div>
                </Link>
                <Link href="/search?category=beach">
                  <div className="bg-card rounded-lg p-4 text-center border hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className="text-2xl mb-2">🏖️</div>
                    <span className="font-medium">Beach House</span>
                  </div>
                </Link>
                <Link href="/search?category=mountain">
                  <div className="bg-card rounded-lg p-4 text-center border hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className="text-2xl mb-2">🏔️</div>
                    <span className="font-medium">Mountain Cabin</span>
                  </div>
                </Link>
                <Link href="/search?category=apartment">
                  <div className="bg-card rounded-lg p-4 text-center border hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className="text-2xl mb-2">🏙️</div>
                    <span className="font-medium">City Apartment</span>
                  </div>
                </Link>
              </div>
            </section>

            {/* Feature Highlights */}
            <section className="space-y-4 bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
              <h3 className="font-heading font-semibold text-lg text-center">Why Choose Houseshare?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl">🎉</div>
                  <div className="text-sm font-semibold">Party Packages</div>
                  <p className="text-xs text-muted-foreground">Sound, lighting & more</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🏆</div>
                  <div className="text-sm font-semibold">Earn Rewards</div>
                  <p className="text-xs text-muted-foreground">Pi & badges</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🤝</div>
                  <div className="text-sm font-semibold">Split Payments</div>
                  <p className="text-xs text-muted-foreground">Book with friends</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl">🛡️</div>
                  <div className="text-sm font-semibold">Safe & Secure</div>
                  <p className="text-xs text-muted-foreground">Verified properties</p>
                </div>
              </div>
              <Button className="w-full" size="lg" asChild>
                <a href="/features">Explore All Features</a>
              </Button>
            </section>
          </main>

          <BottomNav />

          {/* Chat Window */}
          <ChatWindow
            propertyId={chatState.propertyId}
            hostId={chatState.hostId}
            propertyTitle={chatState.propertyTitle}
            isOpen={chatState.isOpen}
            onClose={handleChatClose}
          />

          {/* Booking Modal */}
          {bookingState.property && (
            <BookingModal
              isOpen={bookingState.isOpen}
              onClose={handleBookingClose}
              property={bookingState.property}
            />
          )}

          {/* Reviews Modal */}
          <ReviewsModal
            isOpen={reviewsState.isOpen}
            onClose={handleReviewsClose}
            propertyTitle={reviewsState.propertyTitle}
            averageRating={reviewsState.averageRating}
            totalReviews={reviewsState.totalReviews}
          />

          {/* Side Menu */}
          <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

          {/* Pi Calculator */}
          <PiCalculator />
        </div>
      )}
    </>
  )
}
