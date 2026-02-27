"use client"

import React from "react"
import ArrowLeft from "lucide-react/lib/icons/ArrowLeft" // Import ArrowLeft

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MapPin, Home, DollarSign, Users, Bed, Bath, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddPropertyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    propertyType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    squareFeet: "",
    amenities: [] as string[],
    images: [] as string[],
    houseRules: [] as string[],
    refundPolicy: "flexible",
  })

  const [newRule, setNewRule] = useState("")

  const [imagePreview, setImagePreview] = useState<string[]>([])

  const amenitiesList = [
    "WiFi",
    "Kitchen",
    "Parking",
    "Pool",
    "Air Conditioning",
    "Heating",
    "TV",
    "Washer/Dryer",
    "Hot Tub",
    "Gym",
    "Pet Friendly",
    "BBQ Grill",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImagePreview((prev) => [...prev, ...newImages])
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Property registration data:", formData)
    // Here you would submit to your backend
    alert("Property registered successfully! You can now set up Pi Network payments.")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <BackButton title="Add Your Property" />

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">List Your Space</CardTitle>
            <CardDescription>Share your property with travelers and earn Pi cryptocurrency</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Cozy Downtown Apartment"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, its unique features, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">Entire House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="cabin">Cabin</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="location">City, State/Country *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Square className="h-5 w-5 text-primary" />
                  Property Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      Bedrooms *
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      Bathrooms *
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxGuests" className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max Guests *
                    </Label>
                    <Input
                      id="maxGuests"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={formData.maxGuests}
                      onChange={(e) => handleInputChange("maxGuests", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="squareFeet">Square Feet</Label>
                    <Input
                      id="squareFeet"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.squareFeet}
                      onChange={(e) => handleInputChange("squareFeet", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pricing
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night (in Pi) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">π</span>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: A 5% platform commission will be deducted from each booking
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenitiesList.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.amenities.includes(amenity)
                          ? "bg-primary/10 border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">House Rules</h3>
                <p className="text-sm text-muted-foreground">Set clear expectations for your guests</p>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., No smoking, Check-in after 3PM"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          if (newRule.trim()) {
                            setFormData((prev) => ({
                              ...prev,
                              houseRules: [...prev.houseRules, newRule.trim()],
                            }))
                            setNewRule("")
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newRule.trim()) {
                          setFormData((prev) => ({
                            ...prev,
                            houseRules: [...prev.houseRules, newRule.trim()],
                          }))
                          setNewRule("")
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  {formData.houseRules.length > 0 && (
                    <div className="space-y-2">
                      {formData.houseRules.map((rule, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <span className="text-sm">{rule}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                houseRules: prev.houseRules.filter((_, i) => i !== index),
                              }))
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Policy */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg">Refund Policy</h3>
                <p className="text-sm text-muted-foreground">Choose how guests can cancel their bookings</p>
                
                <Select value={formData.refundPolicy} onValueChange={(value) => handleInputChange("refundPolicy", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select refund policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">
                      <div className="py-1">
                        <div className="font-semibold">Flexible</div>
                        <div className="text-xs text-muted-foreground">Full refund up to 24 hours before check-in</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="moderate">
                      <div className="py-1">
                        <div className="font-semibold">Moderate</div>
                        <div className="text-xs text-muted-foreground">Full refund up to 5 days before check-in</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="strict">
                      <div className="py-1">
                        <div className="font-semibold">Strict</div>
                        <div className="text-xs text-muted-foreground">50% refund up to 1 week before check-in</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="non-refundable">
                      <div className="py-1">
                        <div className="font-semibold">Non-refundable</div>
                        <div className="text-xs text-muted-foreground">No refunds allowed</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Property Images
                </h3>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="images" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload images</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
                    </div>
                  </Label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreview.map((img, idx) => (
                      <img key={idx} src={img || "/placeholder.svg"} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button type="submit" className="w-full font-semibold" size="lg">
                  List Property
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
