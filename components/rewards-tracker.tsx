"use client"

import { TrendingUp, Award, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RewardsTrackerProps {
  action: "booking" | "review" | "referral"
  piAmount: number
  showAnimation?: boolean
}

export function RewardsTracker({ action, piAmount, showAnimation = true }: RewardsTrackerProps) {
  const getActionDetails = () => {
    switch (action) {
      case "booking":
        return { icon: Star, label: "Booking Reward", color: "text-primary" }
      case "review":
        return { icon: Award, label: "Review Reward", color: "text-amber-600" }
      case "referral":
        return { icon: TrendingUp, label: "Referral Bonus", color: "text-green-600" }
    }
  }

  const { icon: Icon, label, color } = getActionDetails()

  return (
    <Card className={`border-primary/30 ${showAnimation ? 'animate-in slide-in-from-top-4' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">Earned π{piAmount}</p>
            </div>
          </div>
          <Badge className="text-base font-bold">+π{piAmount}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
