"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const [settings, setSettings] = useState({
    bookingConfirm: true,
    messages: true,
    promotions: false,
    reminders: true,
    reviews: true,
    priceAlerts: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <BackButton title="알림 설정" />

      <main className="px-4 py-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>예약 알림</CardTitle>
            <CardDescription>예약 관련 알림을 받습니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="booking-confirm" className="flex-1">
                <div>예약 확인</div>
                <p className="text-sm text-muted-foreground font-normal">예약이 확정되면 알림을 받습니다</p>
              </Label>
              <Switch
                id="booking-confirm"
                checked={settings.bookingConfirm}
                onCheckedChange={() => handleToggle("bookingConfirm")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminders" className="flex-1">
                <div>체크인 알림</div>
                <p className="text-sm text-muted-foreground font-normal">체크인 날짜가 가까워지면 알림을 받습니다</p>
              </Label>
              <Switch id="reminders" checked={settings.reminders} onCheckedChange={() => handleToggle("reminders")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>메시지 알림</CardTitle>
            <CardDescription>호스트와의 대화 알림</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="messages" className="flex-1">
                <div>새 메시지</div>
                <p className="text-sm text-muted-foreground font-normal">새로운 메시지를 받으면 알림을 받습니다</p>
              </Label>
              <Switch id="messages" checked={settings.messages} onCheckedChange={() => handleToggle("messages")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>추가 알림</CardTitle>
            <CardDescription>기타 알림 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="reviews" className="flex-1">
                <div>리뷰 요청</div>
                <p className="text-sm text-muted-foreground font-normal">숙박 후 리뷰 작성 요청을 받습니다</p>
              </Label>
              <Switch id="reviews" checked={settings.reviews} onCheckedChange={() => handleToggle("reviews")} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="price-alerts" className="flex-1">
                <div>가격 알림</div>
                <p className="text-sm text-muted-foreground font-normal">관심 숙소의 가격 변동 알림을 받습니다</p>
              </Label>
              <Switch
                id="price-alerts"
                checked={settings.priceAlerts}
                onCheckedChange={() => handleToggle("priceAlerts")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="promotions" className="flex-1">
                <div>프로모션 및 이벤트</div>
                <p className="text-sm text-muted-foreground font-normal">특가 및 이벤트 정보를 받습니다</p>
              </Label>
              <Switch
                id="promotions"
                checked={settings.promotions}
                onCheckedChange={() => handleToggle("promotions")}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
