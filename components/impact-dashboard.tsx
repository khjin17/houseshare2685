"use client"

import { useState } from "react"
import { Leaf, Heart, Award, Store, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SustainabilityManager,
  carbonOffsetProjects,
  type CarbonOffset,
  type SocialImpactDonation,
} from "@/lib/sustainability"

export function ImpactDashboard() {
  const [totalCarbonOffset, setTotalCarbonOffset] = useState(247.5) // kg CO2
  const [totalDonations, setTotalDonations] = useState(125) // Pi
  const [sustainabilityScore, setSustainabilityScore] = useState(78)

  const mockOffsets: CarbonOffset[] = [
    {
      offsetId: "1",
      bookingId: "book-1",
      propertyId: "prop-1",
      estimatedEmissions: 45.2,
      offsetAmount: 0.9,
      offsetProject: "Amazon Reforestation",
      createdAt: new Date(Date.now() - 86400000 * 5),
    },
    {
      offsetId: "2",
      bookingId: "book-2",
      propertyId: "prop-2",
      estimatedEmissions: 67.8,
      offsetAmount: 1.36,
      offsetProject: "Ocean Plastic Cleanup",
      createdAt: new Date(Date.now() - 86400000 * 12),
    },
  ]

  const mockDonations: SocialImpactDonation[] = [
    {
      donationId: "1",
      bookingId: "book-1",
      amount: 50,
      cause: "education",
      organization: "Local School Foundation",
      transactionHash: "0xabc123...",
      createdAt: new Date(Date.now() - 86400000 * 5),
    },
    {
      donationId: "2",
      bookingId: "book-3",
      amount: 75,
      cause: "environment",
      organization: "Green Earth Initiative",
      transactionHash: "0xdef456...",
      createdAt: new Date(Date.now() - 86400000 * 15),
    },
  ]

  const localBusinesses = SustainabilityManager.getLocalBusinesses("Seoul")

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading font-bold">Your Impact</h2>
        <p className="text-muted-foreground">
          Track your environmental and social contributions
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/10">
                <Leaf className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbon Offset</p>
                <p className="text-2xl font-bold">{totalCarbonOffset} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-500/10">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Donations</p>
                <p className="text-2xl font-bold">π {totalDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eco Score</p>
                <p className="text-2xl font-bold">{sustainabilityScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="carbon" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="carbon">Carbon Offset</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="local">Local Support</TabsTrigger>
        </TabsList>

        {/* Carbon Offset Tab */}
        <TabsContent value="carbon" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Carbon Offsets</CardTitle>
              <CardDescription>
                Help fight climate change with every booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockOffsets.map((offset) => (
                <div key={offset.offsetId} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{offset.offsetProject}</p>
                    <p className="text-xs text-muted-foreground">
                      {offset.estimatedEmissions} kg CO2 offset
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {offset.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">π {offset.offsetAmount}</Badge>
                </div>
              ))}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Available Projects</h4>
                <div className="space-y-2">
                  {carbonOffsetProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent"
                    >
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Support
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social Impact Donations</CardTitle>
              <CardDescription>
                A portion of each booking goes to local causes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDonations.map((donation) => (
                <div key={donation.donationId} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{donation.organization}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {donation.cause}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {donation.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">π {donation.amount}</p>
                    <p className="text-xs text-muted-foreground">Donated</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {["Education", "Environment", "Community", "Healthcare"].map((cause) => (
                    <Button key={cause} variant="outline" size="sm">
                      Donate to {cause}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Local Support Tab */}
        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Local Business Partners
              </CardTitle>
              <CardDescription>
                Support local economy with exclusive discounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {localBusinesses.map((business) => (
                <div key={business.partnerId} className="flex items-center gap-4 p-4 rounded-lg border">
                  <img
                    src={business.logo || "/placeholder.svg"}
                    alt={business.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{business.name}</p>
                    <p className="text-xs text-muted-foreground">{business.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {business.distance}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {business.discount}% off
                      </Badge>
                    </div>
                  </div>
                  {business.couponCode && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Code:</p>
                      <p className="font-mono font-bold text-sm">{business.couponCode}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
