"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Users, Loader2, CheckCircle2, X, ChevronRight, Shield, Bell } from "lucide-react"
import { piNetwork, calculatePaymentBreakdown, type PiPayment } from "@/lib/pi-network"
import { rewardsCalculator } from "@/lib/rewards-calculator"
import { EmergencyContactForm } from "@/components/emergency-contact-form"
import { InsuranceOptions } from "@/components/insurance-options"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  property: {
    id: string
    title: string
    price: number
    hostId: string
  }
}

export function BookingModal({ isOpen, onClose, property }: BookingModalProps) {
  const [step, setStep] = useState<"booking" | "safety" | "payment">("booking")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [piUser, setPiUser] = useState<any>(null)
  
  // Safety features
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([])
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null)
  const [enableCheckInAlerts, setEnableCheckInAlerts] = useState(true)

  if (!isOpen) return null

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const nights = calculateNights()
  const baseAmount = property.price * nights
  const insuranceCost = selectedInsurance ? selectedInsurance.price : 0
  const totalAmount = baseAmount + insuranceCost
  const breakdown = calculatePaymentBreakdown(totalAmount)
  
  // Calculate booking reward (assuming Pi price)
  const bookingRewardPi = rewardsCalculator.calculateBookingReward(totalAmount * 0.75) // Convert Pi to USD estimate
  const formattedReward = rewardsCalculator.formatPi(bookingRewardPi)

  // Authenticate with Pi Network
  const handlePiAuth = async () => {
    setIsProcessing(true)
    try {
      const user = await piNetwork.authenticate()
      if (user) {
        setPiUser(user)
        console.log("[v0] Pi user authenticated:", user.username)
      } else {
        alert("Failed to authenticate with Pi Network")
      }
    } catch (error) {
      console.error("[v0] Pi auth error:", error)
      alert("Pi Network authentication failed")
    } finally {
      setIsProcessing(false)
    }
  }

  // Process payment with Pi Network
  const handlePayment = async () => {
    if (!checkIn || !checkOut || nights === 0) {
      alert("Please select valid check-in and check-out dates")
      return
    }

    if (!piUser) {
      // First authenticate
      await handlePiAuth()
      return
    }

    setIsProcessing(true)

    try {
      const payment: PiPayment = {
        amount: totalAmount,
        memo: `Booking for ${property.title} - ${nights} night(s)${selectedInsurance ? ' + Insurance' : ''}`,
        metadata: {
          propertyId: property.id,
          hostId: property.hostId,
          guestId: piUser.uid,
          checkIn,
          checkOut,
          nights,
          emergencyContacts: emergencyContacts.length,
          insurance: selectedInsurance?.id || 'none',
          safetyCheckInEnabled: enableCheckInAlerts,
        },
      }

      const result = await piNetwork.createPayment(payment)
      
      console.log("[v0] Payment result:", result)
      console.log("[v0] Platform commission:", result.platformFee, "Pi")
      console.log("[v0] Host receives:", result.hostAmount, "Pi")

      setPaymentSuccess(true)

      // Reset form after 3 seconds and close
      setTimeout(() => {
        setPaymentSuccess(false)
        onClose()
      }, 3000)
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const canProceedToSafety = checkIn && checkOut && nights > 0
  const canProceedToPayment = emergencyContacts.length > 0

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="font-heading text-xl">{property.title}</CardTitle>
              <CardDescription>
                {step === "booking" && "Step 1: Select dates"}
                {step === "safety" && "Step 2: Safety & Insurance"}
                {step === "payment" && "Step 3: Complete payment"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            <div className={`h-1 flex-1 rounded ${step === "booking" ? "bg-primary" : "bg-primary/30"}`} />
            <div className={`h-1 flex-1 rounded ${step === "safety" ? "bg-primary" : step === "payment" ? "bg-primary/30" : "bg-muted"}`} />
            <div className={`h-1 flex-1 rounded ${step === "payment" ? "bg-primary" : "bg-muted"}`} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentSuccess ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h3 className="font-heading font-bold text-xl mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground">Your payment has been processed successfully</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/30">
                <p className="text-sm font-semibold mb-1">Rewards Earned!</p>
                <p className="text-2xl font-bold text-primary">+{formattedReward}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {rewardsCalculator.piToUSD(bookingRewardPi).toFixed(2)} USD value • Thank you for booking!
                </p>
              </div>
            </div>
          ) : step === "booking" ? (
            <>
              {/* Dates */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="checkIn" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Check-in Date
                  </Label>
                  <input
                    type="date"
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkOut" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Check-out Date
                  </Label>
                  <input
                    type="date"
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Number of Guests
                  </Label>
                  <input
                    type="number"
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              {nights > 0 && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-heading font-semibold">Price Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>π {property.price} × {nights} nights</span>
                      <span>π {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee (5%)</span>
                      <span>-π {breakdown.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Host receives</span>
                      <span>π {breakdown.hostAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-base">
                      <span>Total (You Pay)</span>
                      <span>π {breakdown.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pi User Info */}
              {piUser && (
                <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    π
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Connected as @{piUser.username}</p>
                    <p className="text-xs text-muted-foreground">Pi Network Account</p>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={() => setStep("safety")}
                disabled={!canProceedToSafety}
                className="w-full font-semibold"
                size="lg"
              >
                Continue to Safety & Insurance
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
                Cancel
              </Button>
              {/* Navigation Buttons */}
              {step !== "booking" && !paymentSuccess && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === "safety") setStep("booking")
                    if (step === "payment") setStep("safety")
                  }}
                  className="w-full bg-transparent"
                >
                  Back
                </Button>
              )}
            </>
          ) : step === "safety" ? (
            <div className="space-y-4">
              {/* Check-in Alert Toggle */}
              <Card className="border-blue-500/30 bg-blue-500/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">Safety Check-In Alerts</h3>
                        <input
                          type="checkbox"
                          checked={enableCheckInAlerts}
                          onChange={(e) => setEnableCheckInAlerts(e.target.checked)}
                          className="h-4 w-4"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        We'll send you a check-in reminder 2 hours after arrival. If you don't respond within 4 hours, your emergency contacts will be notified.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <EmergencyContactForm
                onContactsSubmit={(contacts) => {
                  setEmergencyContacts(contacts)
                  console.log("[v0] Emergency contacts saved:", contacts.length)
                }}
                initialContacts={emergencyContacts}
              />

              {/* Insurance Options */}
              <InsuranceOptions
                bookingAmount={baseAmount}
                onSelect={(insurance) => {
                  setSelectedInsurance(insurance)
                  console.log("[v0] Insurance selected:", insurance?.name || 'None')
                }}
              />

              <Button
                onClick={() => setStep("payment")}
                disabled={!canProceedToPayment}
                className="w-full"
                size="lg"
              >
                Continue to Payment
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <>
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span>{nights} night(s)</span>
                    <span className="font-mono">π{baseAmount.toFixed(6)}</span>
                  </div>
                  {selectedInsurance && (
                    <div className="flex justify-between text-blue-600 gap-2">
                      <span className="flex items-center gap-1 min-w-0 flex-1">
                        <Shield className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1 text-xs leading-tight">{selectedInsurance.name}</span>
                      </span>
                      <span className="font-mono shrink-0 text-xs">π{selectedInsurance.price.toFixed(6)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t gap-2">
                    <span>Total</span>
                    <span className="font-mono">π{totalAmount.toFixed(6)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pi User Info */}
              {piUser && (
                <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    π
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Connected as @{piUser.username}</p>
                    <p className="text-xs text-muted-foreground">Pi Network Account</p>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              {!piUser ? (
                <Button
                  onClick={handlePiAuth}
                  disabled={isProcessing}
                  className="w-full font-semibold"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting to Pi...
                    </>
                  ) : (
                    "Connect Pi Network"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full font-semibold"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay π ${breakdown.totalAmount.toFixed(2)}`
                  )}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
