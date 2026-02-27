"use client"

import { MapPin, Train, Bus, Plane } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PropertyMapProps {
  propertyLocation: string
  transportation: Array<{
    type: string
    name: string
    distance: string
    time: string
  }>
  nearbyAttractions: Array<{
    name: string
    distance: string
    type: string
    time: string
  }>
}

export function PropertyMap({ propertyLocation, transportation, nearbyAttractions }: PropertyMapProps) {
  const getTransportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "subway":
        return <Train className="h-4 w-4" />
      case "bus":
        return <Bus className="h-4 w-4" />
      case "airport":
        return <Plane className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Interactive Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
            {/* Simulated map with markers */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
              <div className="text-center space-y-3">
                {/* Property marker (center) */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg animate-pulse">
                        <MapPin className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <p className="font-semibold text-lg">{propertyLocation}</p>
                  <p className="text-sm text-muted-foreground">Property Location</p>
                </div>

                {/* Surrounding markers */}
                <div className="grid grid-cols-4 gap-4 mt-8 px-4">
                  {transportation.slice(0, 2).map((transport, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="bg-secondary text-secondary-foreground rounded-full p-2 shadow">
                        {getTransportIcon(transport.type)}
                      </div>
                      <span className="text-xs mt-1">{transport.distance}</span>
                    </div>
                  ))}
                  {nearbyAttractions.slice(0, 2).map((attraction, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="bg-accent text-accent-foreground rounded-full p-2 shadow">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">{attraction.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map overlay info */}
            <div className="absolute top-3 left-3 bg-background/90 backdrop-blur rounded-lg px-3 py-2 shadow">
              <p className="text-xs font-semibold">Interactive Map View</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transportation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            Public Transportation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {transportation.map((transport, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getTransportIcon(transport.type)}</div>
                <div>
                  <p className="font-semibold text-sm">{transport.name}</p>
                  <p className="text-xs text-muted-foreground">{transport.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{transport.distance}</p>
                <p className="text-xs text-muted-foreground">{transport.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Nearby Attractions with Map Pins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Nearby Attractions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nearbyAttractions.map((attraction, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="font-semibold text-sm">{attraction.name}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {attraction.type}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{attraction.distance}</p>
                <p className="text-xs text-muted-foreground">{attraction.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
