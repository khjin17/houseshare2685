"use client"

import Link from "next/link"
import { Booking } from "@/types/booking" // Import Booking type
import { piSocial, piNetwork } from "@/lib/pi-network" // Import piSocial and piNetwork

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  MapPin,
  Calendar,
  Users,
  Star,
  ChevronRight,
  Bell,
  Globe,
  CreditCard,
  Shield,
  HelpCircle,
  Home as HomeIcon,
  Award,
  TrendingUp,
  UserPlus,
} from "lucide-react"
import { PiCalculator } from "@/components/pi-calculator"
import { getPropertyImage } from "@/lib/placeholder-images"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [piUser, setPiUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    setIsLoading(true)
    try {
      // Get Pi user info
      const user = piSocial.getCurrentUser() || (await piNetwork.authenticate())
      if (user) {
        setPiUser(user)
      }

      // Load bookings (mock data for now)
      const mockBookings: Booking[] = [
        {
          id: "booking-1",
          propertyId: "1",
          propertyTitle: "Luxury Beach Villa",
          propertyImage: getPropertyImage("1", 400, 300),
          location: "Miami Beach, FL",
          checkIn: "2026-02-15",
          checkOut: "2026-02-18",
          guests: 4,
          totalAmount: 0.002864,
          status: "upcoming",
          hostName: "Sarah Johnson",
        },
        {
          id: "booking-2",
          propertyId: "2",
          propertyTitle: "Modern Downtown Loft",
          propertyImage: getPropertyImage("2", 400, 300),
          location: "New York, NY",
          checkIn: "2026-01-10",
          checkOut: "2026-01-12",
          guests: 2,
          totalAmount: 0.001527,
          status: "completed",
          hostName: "Michael Chen",
          rating: 5,
        },
        {
          id: "booking-3",
          propertyId: "3",
          propertyTitle: "Cozy Mountain Cabin",
          propertyImage: getPropertyImage("3", 400, 300),
          location: "Aspen, CO",
          checkIn: "2025-12-20",
          checkOut: "2025-12-25",
          guests: 6,
          totalAmount: 0.003819,
          status: "completed",
          hostName: "Emily Rodriguez",
          rating: 4,
        },
      ]

      setBookings(mockBookings)
    } catch (error) {
      console.error("[v0] Failed to load profile data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500"
      case "completed":
        return "bg-green-500/10 text-green-500"
      case "cancelled":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "예정"
      case "completed":
        return "완료"
      case "cancelled":
        return "취소됨"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="프로필" />

      <main className="px-4 py-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-2xl">
                  {piUser?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-heading font-bold text-xl">{piUser?.username || "Guest User"}</h2>
                <p className="text-sm text-muted-foreground">Pi Network 사용자</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    π {piUser?.uid?.slice(0, 8) || "Not Connected"}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">π0.000039</p>
                <p className="text-xs text-muted-foreground">Total Earned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/dashboard">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">My Rewards</p>
                  <p className="text-xs text-muted-foreground">View badges</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/referral">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <UserPlus className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Invite Friends</p>
                  <p className="text-xs text-muted-foreground">Earn π0.0000095</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bookings">예약 내역</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <HomeIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">아직 예약 내역이 없습니다</p>
                  <Button className="mt-4" asChild>
                    <Link href="/">숙소 둘러보기</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex">
                    <img
                      src={booking.propertyImage || "/placeholder.svg"}
                      alt={booking.propertyTitle}
                      className="w-28 h-28 object-cover"
                    />
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-heading font-semibold text-base leading-tight">
                            {booking.propertyTitle}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {booking.location}
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)} variant="secondary">
                          {getStatusText(booking.status)}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(booking.checkIn).toLocaleDateString("ko-KR")} -{" "}
                            {new Date(booking.checkOut).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>게스트 {booking.guests}명</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="font-heading font-bold text-primary">
                          π {booking.totalAmount.toFixed(2)}
                        </span>
                        {booking.rating && (
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{booking.rating}.0</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-3">
            {/* Host Section */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">호스트 모드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/add-property">
                  <Button className="w-full h-12">
                    <div className="flex items-center gap-3">
                      <HomeIcon className="h-4 w-4" />
                      <span>숙소 추가하기</span>
                    </div>
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  내 숙소를 등록하고 수익을 얻으세요
                </p>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">계정 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/profile/edit">
                  <Button variant="ghost" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      <span>프로필 수정</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/profile/payment">
                  <Button variant="ghost" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4" />
                      <span>결제 정보</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* App Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">앱 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/settings/notifications">
                  <Button variant="ghost" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4" />
                      <span>알림</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/settings/language">
                  <Button variant="ghost" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4" />
                      <span>언어 설정</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/settings/privacy">
                  <Button variant="ghost" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4" />
                      <span>개인정보 보호</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">지원</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/help">
                  <Button variant="ghost" className="w-full justify-between h-12">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4" />
                      <span>도움말 및 문의</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button variant="outline" className="w-full h-12 bg-transparent" onClick={() => console.log("Logout")}>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 mr-2">
                  {/* Placeholder for LogOut icon */}
                </div>
                로그아웃
              </div>
            </Button>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />

      {/* Pi Calculator */}
      <PiCalculator />
    </div>
  )
}
