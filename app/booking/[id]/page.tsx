"use client"

import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/back-button"
import { SmartCheckin } from "@/components/smart-checkin"
import { getPropertyImage } from "@/lib/placeholder-images"
import { MapPin, Calendar, Users, Phone, Mail, MessageSquare, CheckCircle2, Home, MessageCircle } from "lucide-react"

export default function BookingPage() {
  const params = useParams()
  const [showContact, setShowContact] = useState(false)

  // Mock booking data
  const booking = {
    id: params.id,
    propertyTitle: "Modern Luxury Apartment",
    propertyImage: getPropertyImage(params.id as string),
    location: "San Francisco, CA",
    checkIn: new Date("2026-02-15T15:00:00"),
    checkOut: new Date("2026-02-18T11:00:00"),
    guests: 4,
    totalAmount: 480,
    status: "confirmed",
    hostName: "Sarah Johnson",
    hostPhone: "+1 (555) 123-4567",
    hostId: "host-123",
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="Booking Details" />

      <main className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Property Image */}
        <img
          src={booking.propertyImage || "/placeholder.svg"}
          alt={booking.propertyTitle}
          className="w-full h-48 object-cover rounded-lg"
        />

        {/* Status */}
        <div className="flex items-center justify-between">
          <h1 className="font-heading font-bold text-2xl">{booking.propertyTitle}</h1>
          <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
        </div>

        {/* Smart Check-in */}
        <SmartCheckin
          bookingId={booking.id}
          propertyTitle={booking.propertyTitle}
          checkInTime={booking.checkIn}
          checkOutTime={booking.checkOut}
        />

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Check-in</p>
                <p className="text-sm text-muted-foreground">
                  {booking.checkIn.toLocaleDateString()} at {booking.checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Check-out</p>
                <p className="text-sm text-muted-foreground">
                  {booking.checkOut.toLocaleDateString()} at {booking.checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Guests</p>
                <p className="text-sm text-muted-foreground">{booking.guests} guests</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{booking.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Booking ID</p>
                <p className="text-sm text-muted-foreground font-mono">{booking.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Host Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Host</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary">{booking.hostName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">{booking.hostName}</p>
                <p className="text-sm text-muted-foreground">Property Host</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Amount</span>
              <span className="font-semibold">π{booking.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Rewards Earned</span>
              <span className="font-semibold text-green-600">+π0.000159</span>
            </div>
            <div className="pt-2 border-t flex justify-between font-bold">
              <span>Paid</span>
              <span className="text-primary">π{booking.totalAmount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full bg-transparent">
            Get Directions
          </Button>
          <Button variant="outline" className="w-full text-destructive bg-transparent">
            Cancel Booking
          </Button>
        </div>
      </main>
    </div>
  )
}
