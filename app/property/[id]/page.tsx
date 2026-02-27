"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Utensils,
  Shield,
  RotateCcw,
  Train,
  Landmark,
  Navigation,
  Clock,
  PartyPopper,
  UsersRound,
  Sparkles
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PropertyMap } from "@/components/property-map"
import { PartyBookingModal } from "@/components/party-booking-modal"
import { GroupBookingSplit } from "@/components/group-booking-split"
import { getPropertyGallery } from "@/lib/placeholder-images"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [partyModalOpen, setPartyModalOpen] = useState(false)
  const [groupBookingOpen, setGroupBookingOpen] = useState(false)

  // Mock data - 실제로는 API에서 가져옴
  const property = {
    id: params.id,
    title: "Modern Beach House with Ocean View",
    location: "Busan, South Korea",
    price: 0.000477,
    rating: 4.8,
    reviews: 124,
    images: getPropertyGallery(params.id, 5),
    host: {
      name: "Sarah Kim",
      avatar: "https://i.pravatar.cc/150?img=5",
      verified: true,
      joinedDate: "2022",
    },
    details: {
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
    },
    description: "Beautiful modern beach house with stunning ocean views. Perfect for families or groups looking for a relaxing getaway.",
    amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "TV", "Washer/Dryer"],
    houseRules: [
      "Check-in: After 3:00 PM",
      "Checkout: Before 11:00 AM",
      "No smoking",
      "No pets allowed",
      "No parties or events",
      "Quiet hours: 10:00 PM - 8:00 AM",
    ],
    refundPolicy: {
      type: "Flexible",
      description: "Full refund up to 24 hours before check-in. Cancel within 24 hours of check-in and get a 50% refund.",
      details: [
        "Free cancellation up to 24 hours before check-in",
        "50% refund if cancelled within 24 hours of check-in",
        "No refund after check-in",
      ]
    },
    nearbyAttractions: [
      { name: "Haeundae Beach", distance: "0.5 km", type: "Beach", time: "5 min walk" },
      { name: "Busan Aquarium", distance: "1.2 km", type: "Attraction", time: "10 min walk" },
      { name: "Dongbaek Island", distance: "2.0 km", type: "Nature", time: "25 min walk" },
      { name: "The Bay 101", distance: "3.5 km", type: "Entertainment", time: "10 min drive" },
    ],
    transportation: [
      { type: "Subway", name: "Haeundae Station (Line 2)", distance: "800m", time: "10 min walk" },
      { type: "Bus", name: "Bus Stop 139, 140", distance: "200m", time: "2 min walk" },
      { type: "Airport", name: "Gimhae International Airport", distance: "25 km", time: "40 min drive" },
    ]
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="Property Details" />

      <main className="pb-6">
        {/* Images */}
        <div className="w-full h-64 bg-muted">
          <img 
            src={property.images[0] || "/placeholder.svg"} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-heading font-bold text-2xl text-balance">{property.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{property.rating}</span>
                <span>({property.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-heading font-bold text-primary">π {property.price}</span>
              <span className="text-muted-foreground">/ night</span>
            </div>
          </div>

          {/* Host Info */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={property.host.avatar || "/placeholder.svg"} />
                <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{property.host.name}</span>
                  {property.host.verified && (
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Host since {property.host.joinedDate}</p>
              </div>
              <Button variant="outline" size="sm">Contact</Button>
            </CardContent>
          </Card>

          {/* Special Features */}
          <div className="grid grid-cols-1 gap-3">
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PartyPopper className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm">Party & Event Packages</h3>
                      <p className="text-xs text-muted-foreground">Add equipment, catering & more</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setPartyModalOpen(true)}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-cyan-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UsersRound className="h-6 w-6 text-cyan-600" />
                    <div>
                      <h3 className="font-semibold text-sm">Group Booking & Split Payment</h3>
                      <p className="text-xs text-muted-foreground">Share cost with friends easily</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setGroupBookingOpen(true)}>
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{property.details.guests} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{property.details.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{property.details.bathrooms} bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{property.details.squareFeet} sq ft</span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Different Sections */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="description" className="text-xs">Info</TabsTrigger>
              <TabsTrigger value="rules" className="text-xs">Rules</TabsTrigger>
              <TabsTrigger value="refund" className="text-xs">Refund</TabsTrigger>
              <TabsTrigger value="nearby" className="text-xs">Nearby</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{property.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* House Rules Tab */}
            <TabsContent value="rules" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">House Rules</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {property.houseRules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span className="text-sm leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Refund Policy Tab */}
            <TabsContent value="refund" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Refund Policy: {property.refundPolicy.type}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{property.refundPolicy.description}</p>
                  <div className="space-y-2">
                    {property.refundPolicy.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nearby & Transportation Tab with Map */}
            <TabsContent value="nearby" className="mt-4">
              <PropertyMap
                propertyLocation={property.location}
                transportation={property.transportation}
                nearbyAttractions={property.nearbyAttractions}
              />
            </TabsContent>
          </Tabs>

          {/* Book Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
            <Button className="w-full h-12 text-base">Book Now</Button>
          </div>
        </div>
      </main>

      {/* Party Booking Modal */}
      <PartyBookingModal
        isOpen={partyModalOpen}
        onClose={() => setPartyModalOpen(false)}
        property={{
          id: property.id,
          title: property.title,
          price: property.price,
          baseGuests: 4,
          maxGuests: property.details.guests,
          pricePerExtraGuest: 0.000064,
        }}
      />

      {/* Group Booking Modal */}
      <GroupBookingSplit
        isOpen={groupBookingOpen}
        onClose={() => setGroupBookingOpen(false)}
        property={{
          id: property.id,
          title: property.title,
          basePrice: property.price,
        }}
      />
    </div>
  )
}
