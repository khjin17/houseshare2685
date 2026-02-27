"use client"

import { memo } from "react"
import { PropertyCard } from "@/components/property-card"

interface PropertyListProps {
  properties: any[]
  onChatClick?: (propertyId: string, hostId: string, title: string) => void
  onBookClick?: (propertyId: string, hostId: string, title: string, price: number) => void
  onReviewsClick?: (propertyTitle: string, rating: number, reviews: number) => void
}

function PropertyListComponent({ 
  properties, 
  onChatClick, 
  onBookClick, 
  onReviewsClick 
}: PropertyListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          {...property}
          onChatClick={onChatClick}
          onBookClick={onBookClick}
          onReviewsClick={onReviewsClick}
        />
      ))}
    </div>
  )
}

export const PropertyList = memo(PropertyListComponent)
