"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PiCalculator } from "@/components/pi-calculator"
import { getPropertyImage } from "@/lib/placeholder-images"

interface Location {
  latitude: number
  longitude: number
}

export default function NearbyPage() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt")

  const checkPermission = async () => {
    // Check if Permissions API is available
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        setPermissionState(result.state as "prompt" | "granted" | "denied")
        
        // Listen for permission changes
        result.onchange = () => {
          setPermissionState(result.state as "prompt" | "granted" | "denied")
        }
        
        return result.state
      } catch (e) {
        console.log("[v0] Permissions API not fully supported, falling back")
      }
    }
    return "prompt"
  }

  const requestLocation = async () => {
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 서비스를 지원하지 않습니다")
      setPermissionState("unsupported")
      setIsLoading(false)
      return
    }

    // Check permission first
    const permState = await checkPermission()
    
    if (permState === "denied") {
      setError("위치 권한이 필요합니다")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setLocation(loc)
        setPermissionState("granted")
        loadNearbyProperties(loc)
        setIsLoading(false)
      },
      (err) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다."
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "위치 권한이 필요합니다"
            setPermissionState("denied")
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다. GPS를 켜주세요."
            break
          case err.TIMEOUT:
            errorMessage = "위치 요청 시간이 초과되었습니다. 다시 시도해주세요."
            break
        }
        
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 // Cache for 1 minute
      }
    )
  }

  const loadNearbyProperties = (loc: Location) => {
    // Mock nearby properties based on location
    const mockProperties = [
      {
        id: "nearby-1",
        title: "Modern Apartment Near You",
        location: "0.5km away",
        price: 0.000382,
        rating: 4.8,
        reviews: 45,
        image: getPropertyImage("nearby-1", 400, 300),
        hostId: "host-1",
      },
      {
        id: "nearby-2",
        title: "Cozy Studio Close By",
        location: "1.2km away",
        price: 0.000302,
        rating: 4.6,
        reviews: 32,
        image: getPropertyImage("nearby-2", 400, 300),
        hostId: "host-2",
      },
      {
        id: "nearby-3",
        title: "Luxury Penthouse",
        location: "2.0km away",
        price: 0.000891,
        rating: 4.9,
        reviews: 78,
        image: getPropertyImage("nearby-3", 400, 300),
        hostId: "host-3",
      },
    ]
    setProperties(mockProperties)
  }

  useEffect(() => {
    const initLocation = async () => {
      // Check permission status first
      const permState = await checkPermission()
      
      // Only auto-request if permission was previously granted
      if (permState === "granted") {
        requestLocation()
      } else if (permState === "denied") {
        setError("위치 권한이 필요합니다")
      }
      // If "prompt", wait for user to click button
    }
    
    initLocation()
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="내 주변 숙소" />

      <main className="px-4 py-6 space-y-6">
        {/* Location Status Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">현재 위치</h3>
                {location ? (
                  <p className="text-xs text-muted-foreground">
                    위도: {location.latitude.toFixed(4)}, 경도: {location.longitude.toFixed(4)}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">위치 정보를 가져오는 중...</p>
                )}
              </div>
              {!isLoading && (
                <Button size="sm" variant="outline" onClick={requestLocation}>
                  새로고침
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">위치 정보를 가져오는 중...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-destructive">{error}</h3>
                  {permissionState === "denied" && (
                    <div className="text-sm text-muted-foreground space-y-3 text-left bg-background/50 p-4 rounded-lg">
                      <p className="font-semibold text-foreground">위치 권한 허용 방법:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>휴대폰 <strong>설정</strong> 앱을 엽니다</li>
                        <li><strong>앱</strong> 또는 <strong>애플리케이션</strong>을 선택합니다</li>
                        <li><strong>Pi Browser</strong>를 찾아 선택합니다</li>
                        <li><strong>권한</strong> 또는 <strong>앱 권한</strong>을 탭합니다</li>
                        <li><strong>위치</strong> 권한을 <strong>허용</strong>으로 변경합니다</li>
                      </ol>
                      <p className="text-xs text-muted-foreground pt-2">
                        권한 변경 후 아래 버튼을 눌러주세요
                      </p>
                    </div>
                  )}
                </div>
                <Button onClick={requestLocation} size="lg" className="w-full">
                  다시 시도
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties List */}
        {!isLoading && !error && properties.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-xl mb-2">주변 숙소</h2>
            <p className="text-sm text-muted-foreground">
              현재 위치에서 가까운 {properties.length}개의 숙소를 찾았습니다
            </p>
            <div className="space-y-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        )}

        {/* Initial Prompt State */}
        {!isLoading && !error && !location && permissionState === "prompt" && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">주변 숙소 찾기</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    현재 위치를 기반으로 가까운 숙소를 추천해드립니다
                  </p>
                </div>
                <Button onClick={requestLocation} size="lg" className="w-full gradient-accent">
                  <MapPin className="h-5 w-5 mr-2" />
                  내 위치에서 숙소 찾기
                </Button>
                <p className="text-xs text-muted-foreground">
                  위치 권한이 필요합니다
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && location && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              주변에 이용 가능한 숙소가 없습니다
            </p>
          </div>
        )}
      </main>

      {/* Pi Calculator */}
      <PiCalculator />
    </div>
  )
}
