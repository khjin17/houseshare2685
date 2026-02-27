"use client"

import { useState } from "react"
import { Smartphone, Lock, Unlock, CheckCircle, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SmartCheckinProps {
  bookingId: string
  propertyTitle: string
  checkInTime: Date
  checkOutTime: Date
}

export function SmartCheckin({ bookingId, propertyTitle, checkInTime, checkOutTime }: SmartCheckinProps) {
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [isLocked, setIsLocked] = useState(true)
  const [checkInComplete, setCheckInComplete] = useState(false)

  const now = new Date()
  const canCheckIn = now >= new Date(checkInTime.getTime() - 30 * 60000) // 30 minutes before
  const canCheckOut = now >= new Date(checkOutTime.getTime() - 60 * 60000) // 1 hour before

  const handleUnlock = async () => {
    setIsUnlocking(true)
    console.log("[v0] Unlocking door for booking:", bookingId)
    
    // Simulate smart lock API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLocked(false)
    if (!checkInComplete) {
      setCheckInComplete(true)
    }
    setIsUnlocking(false)
    console.log("[v0] Door unlocked successfully")
  }

  const handleLock = async () => {
    setIsUnlocking(true)
    console.log("[v0] Locking door for booking:", bookingId)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLocked(true)
    setIsUnlocking(false)
    console.log("[v0] Door locked successfully")
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Smart Check-in
        </CardTitle>
        <CardDescription>{propertyTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Check-in</p>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <p className="text-sm font-medium">{checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Check-out</p>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <p className="text-sm font-medium">{checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        {checkInComplete && (
          <Badge className="w-full justify-center py-2 bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Checked In
          </Badge>
        )}

        <div className="space-y-2">
          {!canCheckIn ? (
            <p className="text-xs text-muted-foreground text-center">
              Check-in available 30 minutes before scheduled time
            </p>
          ) : (
            <>
              <Button
                className="w-full"
                size="lg"
                onClick={isLocked ? handleUnlock : handleLock}
                disabled={isUnlocking}
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : isLocked ? (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Unlock Door
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Lock Door
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Tap to {isLocked ? 'unlock' : 'lock'} the smart lock
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
