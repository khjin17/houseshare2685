"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { PropertyCard } from "@/components/property-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { PiCalculator } from "@/components/pi-calculator"
import { getPropertyImage } from "@/lib/placeholder-images"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])

  const allProperties = [
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
      category: "apartment"
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
      category: "house"
    },
    {
      id: "3",
      title: "Beachfront Villa",
      location: "Miami, FL",
      price: 0.001114,
      rating: 4.9,
      reviews: 203,
      image: getPropertyImage("3", 400, 300),
      verificationLevel: "premium" as const,
      hasNFT: true,
      category: "beach"
    },
    {
      id: "4",
      title: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      price: 0.000891,
      rating: 4.7,
      reviews: 156,
      image: getPropertyImage("4", 400, 300),
      verificationLevel: "verified" as const,
      hasNFT: false,
      category: "mountain"
    },
  ]

  useEffect(() => {
    let filtered = allProperties

    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProperties(filtered)
  }, [searchQuery, category])

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 glass border-b-2 border-primary/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 p-4">
          <BackButton />
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-primary/20"
              />
            </div>
            <Button variant="outline" size="icon" className="border-primary/30 bg-transparent">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Search className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              검색 결과가 없습니다
            </p>
          </div>
        )}
      </main>

      {/* Pi Calculator */}
      <PiCalculator />
    </div>
  )
}
