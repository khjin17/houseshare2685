"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Calendar, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set("q", location)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="glass rounded-2xl p-5 shadow-xl border-2 border-white/20 backdrop-blur-xl">
      <div className="space-y-3">
        {/* Location Search with Nearby Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
            <Input 
              placeholder="Where do you want to stay?" 
              className="pl-11 h-14 border-2 border-primary/20 focus:border-primary rounded-xl text-base bg-white/50" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Link href="/nearby">
            <Button type="button" size="icon" variant="outline" className="h-14 w-14 shrink-0 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 hover:scale-105 transition-transform rounded-xl">
              <Navigation className="h-5 w-5 text-primary" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary h-5 w-5" />
            <Input 
              placeholder="Check-in" 
              className="pl-11 h-14 border-2 border-secondary/20 focus:border-secondary rounded-xl bg-white/50" 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary h-5 w-5" />
            <Input 
              placeholder="Check-out" 
              className="pl-11 h-14 border-2 border-secondary/20 focus:border-secondary rounded-xl bg-white/50" 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-14 text-base font-bold gradient-accent hover:opacity-90 transition-all shadow-lg glow-pi rounded-xl border-0">
          <Search className="mr-2 h-5 w-5" />
          Search Houses
        </Button>
      </div>
    </form>
  )
}
