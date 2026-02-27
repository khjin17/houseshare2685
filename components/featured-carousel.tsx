"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPropertyImage } from "@/lib/placeholder-images"

const featuredProperties = [
  {
    id: "featured-1",
    title: "Luxury Beach House",
    location: "Malibu, CA",
    image: getPropertyImage("featured-1"),
  },
  {
    id: "featured-2",
    title: "Mountain Cabin Retreat",
    location: "Aspen, CO",
    image: getPropertyImage("featured-2"),
  },
  {
    id: "featured-3",
    title: "Modern City Loft",
    location: "New York, NY",
    image: getPropertyImage("featured-3"),
  },
]

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProperties.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProperties.length) % featuredProperties.length)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredProperties.map((property) => (
          <Link key={property.id} href={`/property/${property.id}`} className="block w-full flex-shrink-0 relative cursor-pointer group">
            <img src={property.image || "/placeholder.svg"} alt={property.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-heading font-bold text-xl mb-1">{property.title}</h3>
              <p className="text-sm opacity-90">{property.location}</p>
            </div>
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          prevSlide()
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          nextSlide()
        }}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        {featuredProperties.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
