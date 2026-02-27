"use client"

import { useState } from "react"
import { Users, DollarSign, Check, Copy, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GroupBookingManager, type GroupParticipant } from "@/lib/group-booking"

interface GroupBookingSplitProps {
  isOpen: boolean
  onClose: () => void
  property: {
    id: string
    title: string
    basePrice: number
  }
}

export function GroupBookingSplit({ isOpen, onClose, property }: GroupBookingSplitProps) {
  const [nights, setNights] = useState(1)
  const totalCost = property.basePrice * nights
  
  const [booking, setBooking] = useState({
    id: `group-${Date.now()}`,
    propertyId: property.id,
    totalCost: totalCost,
    participants: [
      {
        userId: "current-user",
        username: "You",
        email: "you@example.com",
        shareAmount: totalCost,
        paymentStatus: "pending" as const,
        joinedAt: new Date(),
      }
    ],
    status: "pending" as const,
    createdAt: new Date(),
  })
  const [newParticipantEmail, setNewParticipantEmail] = useState("")
  const [newParticipantName, setNewParticipantName] = useState("")
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal")
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const updateBooking = (newBooking: typeof booking) => {
    setBooking(newBooking)
  }

  const handleAddParticipant = () => {
    if (!newParticipantEmail || !newParticipantName) return

    const currentTotal = property.basePrice * nights
    const equalSplit = GroupBookingManager.splitEqually(
      currentTotal,
      booking.participants.length + 1
    )

    const participant: Omit<GroupParticipant, "joinedAt" | "paymentStatus"> = {
      userId: `user-${Date.now()}`,
      username: newParticipantName,
      email: newParticipantEmail,
      shareAmount: equalSplit[booking.participants.length] || 0,
    }

    const updatedBooking = GroupBookingManager.addParticipant(booking, participant)

    // Recalculate equal splits for all participants
    if (splitMethod === "equal") {
      const newSplits = GroupBookingManager.splitEqually(
        currentTotal,
        updatedBooking.participants.length
      )
      updatedBooking.participants = updatedBooking.participants.map((p, idx) => ({
        ...p,
        shareAmount: newSplits[idx],
      }))
    }

    updateBooking(updatedBooking)
    setNewParticipantEmail("")
    setNewParticipantName("")
  }

  const handleEqualSplit = () => {
    const splits = GroupBookingManager.splitEqually(
      booking.totalCost,
      booking.participants.length
    )

    const updatedBooking = {
      ...booking,
      participants: booking.participants.map((p, idx) => ({
        ...p,
        shareAmount: splits[idx],
      })),
    }

    updateBooking(updatedBooking)
    setSplitMethod("equal")
  }

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/group/${booking.groupId}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalPaid = booking.participants
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.shareAmount, 0)

  const canConfirm = GroupBookingManager.canConfirmBooking(booking)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Group Booking & Split Payment
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                {property.title}
              </CardTitle>
              <CardDescription>{property.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">π {booking.totalCost}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold text-primary">π {totalPaid.toFixed(1)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShareLink}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </>
                  )}
                </Button>
                {canConfirm && (
                  <Button className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
                )}
              </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
