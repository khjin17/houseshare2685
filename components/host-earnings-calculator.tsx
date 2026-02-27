"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Home, DollarSign, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

const PI_TO_USD = 314159 // 1 Pi = $314,159

export function HostEarningsCalculator() {
  const [location, setLocation] = useState("")
  const [bedrooms, setBedrooms] = useState(2)
  const [nightsPerMonth, setNightsPerMonth] = useState(15)
  const [suggestedPriceUSD, setSuggestedPriceUSD] = useState(150)
  
  // Calculate Pi prices based on USD values
  const suggestedPricePi = suggestedPriceUSD / PI_TO_USD
  const monthlyEarningsPi = suggestedPricePi * nightsPerMonth
  const yearlyEarningsPi = monthlyEarningsPi * 12
  const platformFeePi = monthlyEarningsPi * 0.05
  const netEarningsPi = monthlyEarningsPi - platformFeePi

  useEffect(() => {
    // Simulate AI price suggestion based on inputs
    const basePrice = 100
    const bedroomMultiplier = bedrooms * 25
    const locationBonus = location.length > 0 ? 20 : 0
    setSuggestedPriceUSD(basePrice + bedroomMultiplier + locationBonus)
  }, [bedrooms, location])

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          수익 계산기
        </CardTitle>
        <p className="text-sm text-muted-foreground">내 숙소로 얼마나 벌 수 있을까요?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="location">지역</Label>
            <Input
              id="location"
              placeholder="예: 서울 강남구"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label>방 개수: {bedrooms}개</Label>
            <Slider
              value={[bedrooms]}
              onValueChange={(v) => setBedrooms(v[0])}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>월 대여 일수: {nightsPerMonth}일</Label>
            <Slider
              value={[nightsPerMonth]}
              onValueChange={(v) => setNightsPerMonth(v[0])}
              min={1}
              max={30}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        {/* Earnings Display */}
        <div className="space-y-3 p-4 rounded-lg bg-background border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI 추천 가격 (1박)</span>
            <div className="text-right">
              <span className="font-semibold">π{suggestedPricePi.toFixed(6)}</span>
              <p className="text-xs text-muted-foreground">${suggestedPriceUSD}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">월 총 수익</span>
            <div className="text-right">
              <span className="font-semibold">π{monthlyEarningsPi.toFixed(6)}</span>
              <p className="text-xs text-muted-foreground">${(monthlyEarningsPi * PI_TO_USD).toFixed(0)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">플랫폼 수수료 (5%)</span>
            <span>-π{platformFeePi.toFixed(6)}</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-medium">월 순수익</span>
            <div className="text-right">
              <span className="text-xl font-bold text-primary">π{netEarningsPi.toFixed(6)}</span>
              <p className="text-xs text-muted-foreground">${(netEarningsPi * PI_TO_USD).toFixed(0)}</p>
            </div>
          </div>
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">연간 예상 수익</p>
            <p className="text-lg font-bold text-green-600">π{yearlyEarningsPi.toFixed(4)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              약 ${(yearlyEarningsPi * PI_TO_USD).toFixed(0)} USD
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link href="/become-host">
          <Button className="w-full" size="lg">
            지금 호스트 시작하기
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
