"use client"

import { useState } from "react"
import { X, Users, Calendar, Package, Sparkles, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  partyPackages,
  cleaningServices,
  PartyServiceManager,
  type PartyPackage,
  type CleaningService,
} from "@/lib/party-packages"

interface PartyBookingModalProps {
  isOpen: boolean
  onClose: () => void
  property: {
    id: string
    title: string
    price: number
    baseGuests: number
    maxGuests: number
    pricePerExtraGuest: number
  }
}

export function PartyBookingModal({ isOpen, onClose, property }: PartyBookingModalProps) {
  const [guestCount, setGuestCount] = useState(property.baseGuests)
  const [nights, setNights] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState<PartyPackage | null>(null)
  const [selectedCleaning, setSelectedCleaning] = useState<CleaningService | null>(null)
  const [includeNoiseDeposit, setIncludeNoiseDeposit] = useState(true)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  if (!isOpen) return null

  const costBreakdown = PartyServiceManager.calculateTotalCost({
    propertyPrice: property.price,
    nights,
    selectedPackage: selectedPackage || undefined,
    cleaningService: selectedCleaning || undefined,
    baseGuests: property.baseGuests,
    actualGuests: guestCount,
    pricePerExtraGuest: property.pricePerExtraGuest,
    includeNoiseDeposit,
  })

  const handleBooking = async () => {
    console.log("[v0] Party booking initiated:", {
      property: property.id,
      guestCount,
      nights,
      package: selectedPackage?.name,
      cleaning: selectedCleaning?.name,
      total: costBreakdown.total,
    })
    
    // Integration with payment system would go here
    alert(`Party booking created! Total: π ${costBreakdown.total}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Party Booking
              </CardTitle>
              <CardDescription>{property.title}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Dates and Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in</Label>
              <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Check-out</Label>
              <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Number of Guests
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={1}
                max={property.maxGuests}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">
                Max: {property.maxGuests} guests
              </span>
            </div>
            {guestCount > property.baseGuests && (
              <p className="text-xs text-muted-foreground">
                +π {costBreakdown.extraGuestTotal} for {guestCount - property.baseGuests} extra guests
              </p>
            )}
          </div>

          {/* Party Packages */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Party Package (Optional)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {partyPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "border-primary ring-2 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPackage(pkg.id === selectedPackage?.id ? null : pkg)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">{pkg.icon}</div>
                      <Badge variant="secondary">π {pkg.price}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{pkg.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{pkg.description}</p>
                    <div className="space-y-1">
                      {pkg.includes.slice(0, 3).map((item, idx) => (
                        <p key={idx} className="text-xs">• {item}</p>
                      ))}
                      {pkg.includes.length > 3 && (
                        <p className="text-xs text-primary">+{pkg.includes.length - 3} more...</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cleaning Service */}
          <div className="space-y-3">
            <Label>Post-Party Cleaning Service (Recommended)</Label>
            <Select
              value={selectedCleaning?.id || "none"}
              onValueChange={(value) => {
                if (value === "none") {
                  setSelectedCleaning(null)
                } else {
                  setSelectedCleaning(cleaningServices.find((s) => s.id === value) || null)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cleaning service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No cleaning service</SelectItem>
                {cleaningServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="py-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold">{service.name}</span>
                        <span className="text-primary">π {service.price}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{service.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Noise Deposit */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="noise-deposit"
                  checked={includeNoiseDeposit}
                  onCheckedChange={(checked) => setIncludeNoiseDeposit(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="noise-deposit" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4 text-primary" />
                    Noise Deposit Protection
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Refundable deposit of π {costBreakdown.noiseDeposit} to ensure respectful use.
                    Automatically returned within 24 hours if no violations reported.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Cost Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Property ({nights} night{nights > 1 ? "s" : ""})</span>
                <span>π {costBreakdown.propertyTotal}</span>
              </div>
              {costBreakdown.packageTotal > 0 && (
                <div className="flex justify-between">
                  <span>Party Package</span>
                  <span>π {costBreakdown.packageTotal}</span>
                </div>
              )}
              {costBreakdown.cleaningTotal > 0 && (
                <div className="flex justify-between">
                  <span>Cleaning Service</span>
                  <span>π {costBreakdown.cleaningTotal}</span>
                </div>
              )}
              {costBreakdown.extraGuestTotal > 0 && (
                <div className="flex justify-between">
                  <span>Extra Guest Fee</span>
                  <span>π {costBreakdown.extraGuestTotal}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Platform Fee (5%)</span>
                <span>π {costBreakdown.platformFee.toFixed(1)}</span>
              </div>
              {includeNoiseDeposit && (
                <div className="flex justify-between text-primary">
                  <span>Noise Deposit (Refundable)</span>
                  <span>π {costBreakdown.noiseDeposit}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">π {costBreakdown.total.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleBooking}>
              Confirm Party Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
