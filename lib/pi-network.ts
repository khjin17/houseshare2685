// Pi Network Payment Integration for houseshare app

export interface PiPayment {
  amount: number
  memo: string
  metadata: {
    propertyId: string
    hostId: string
    guestId: string
    checkIn: string
    checkOut: string
    nights: number
  }
}

export interface PiPaymentResult {
  paymentId: string
  txid: string
  status: "completed" | "pending" | "cancelled"
  amount: number
  platformFee: number
  hostAmount: number
}

export interface PiUser {
  uid: string
  username: string
}

// Commission rate for platform (5%)
export const PLATFORM_COMMISSION_RATE = 0.05

// Calculate platform fee and host payout
export function calculatePaymentBreakdown(totalAmount: number) {
  const platformFee = totalAmount * PLATFORM_COMMISSION_RATE
  const hostAmount = totalAmount - platformFee
  
  return {
    totalAmount,
    platformFee: Number(platformFee.toFixed(2)),
    hostAmount: Number(hostAmount.toFixed(2)),
  }
}

// Pi Network SDK Integration
export class PiNetworkService {
  private isInitialized = false
  private piSDK: any = null

  // Initialize Pi Network SDK
  async initialize() {
    if (this.isInitialized) return

    // Check if Pi SDK is available
    if (typeof window !== "undefined" && (window as any).Pi) {
      this.piSDK = (window as any).Pi
      this.isInitialized = true
      console.log("[v0] Pi Network SDK initialized")
    } else {
      console.warn("[v0] Pi Network SDK not available. Using mock mode.")
      // For development, use mock mode
      this.piSDK = this.createMockPiSDK()
      this.isInitialized = true
    }
  }

  // Authenticate user with Pi Network
  async authenticate(): Promise<PiUser | null> {
    await this.initialize()

    try {
      if (!this.piSDK) {
        throw new Error("Pi SDK not initialized")
      }

      const scopes = ["username", "payments"]
      const authResult = await this.piSDK.authenticate(scopes, onIncompletePaymentFound)
      
      console.log("[v0] Pi authentication successful:", authResult.user.username)
      
      return {
        uid: authResult.user.uid,
        username: authResult.user.username,
      }
    } catch (error) {
      console.error("[v0] Pi authentication failed:", error)
      return null
    }
  }

  // Create payment with Pi Network
  async createPayment(payment: PiPayment): Promise<PiPaymentResult> {
    await this.initialize()

    try {
      if (!this.piSDK) {
        throw new Error("Pi SDK not initialized")
      }

      // Calculate breakdown
      const breakdown = calculatePaymentBreakdown(payment.amount)

      // Create payment with Pi Network
      const paymentData = {
        amount: payment.amount,
        memo: payment.memo,
        metadata: {
          ...payment.metadata,
          platformFee: breakdown.platformFee,
          hostAmount: breakdown.hostAmount,
        },
      }

      const paymentResult = await this.piSDK.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("[v0] Payment ready for approval:", paymentId)
          // Here you would call your backend to approve the payment
          this.approvePayment(paymentId)
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("[v0] Payment ready for completion:", paymentId, txid)
          // Here you would call your backend to complete the payment
          this.completePayment(paymentId, txid)
        },
        onCancel: (paymentId: string) => {
          console.log("[v0] Payment cancelled:", paymentId)
        },
        onError: (error: Error, payment?: any) => {
          console.error("[v0] Payment error:", error)
        },
      })

      return {
        paymentId: paymentResult.identifier,
        txid: paymentResult.identifier,
        status: "completed",
        amount: breakdown.totalAmount,
        platformFee: breakdown.platformFee,
        hostAmount: breakdown.hostAmount,
      }
    } catch (error) {
      console.error("[v0] Payment creation failed:", error)
      throw error
    }
  }

  // Approve payment on server
  private async approvePayment(paymentId: string) {
    try {
      // Call your backend API to approve payment
      const response = await fetch("/api/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve payment")
      }

      console.log("[v0] Payment approved:", paymentId)
    } catch (error) {
      console.error("[v0] Payment approval failed:", error)
    }
  }

  // Complete payment on server
  private async completePayment(paymentId: string, txid: string) {
    try {
      // Call your backend API to complete payment
      const response = await fetch("/api/payments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid }),
      })

      if (!response.ok) {
        throw new Error("Failed to complete payment")
      }

      console.log("[v0] Payment completed:", paymentId)
    } catch (error) {
      console.error("[v0] Payment completion failed:", error)
    }
  }

  // Get current authenticated user
  getCurrentUser(): PiUser | null {
    try {
      // In a real implementation, this would check for stored auth token/session
      // For now, return mock user in development
      return {
        uid: "mock-user-123",
        username: "mock_user",
      }
    } catch (error) {
      console.error("[v0] Failed to get current user:", error)
      return null
    }
  }

  // Mock Pi SDK for development
  private createMockPiSDK() {
    return {
      authenticate: async (scopes: string[], onIncompletePaymentFound: any) => {
        console.log("[v0] Mock Pi authentication")
        return {
          user: {
            uid: "mock-user-123",
            username: "mock_user",
          },
          accessToken: "mock-token",
        }
      },
      createPayment: async (payment: any, callbacks: any) => {
        console.log("[v0] Mock Pi payment created:", payment)
        
        // Simulate payment flow
        setTimeout(() => {
          const mockPaymentId = `pi-payment-${Date.now()}`
          callbacks.onReadyForServerApproval(mockPaymentId)
          
          setTimeout(() => {
            callbacks.onReadyForServerCompletion(mockPaymentId, `txid-${Date.now()}`)
          }, 1000)
        }, 500)

        return {
          identifier: `pi-payment-${Date.now()}`,
          user_uid: "mock-user-123",
          amount: payment.amount,
          memo: payment.memo,
          metadata: payment.metadata,
          to_address: "mock-address",
          created_at: new Date().toISOString(),
        }
      },
    }
  }
}

// Handle incomplete payments
function onIncompletePaymentFound(payment: any) {
  console.log("[v0] Incomplete payment found:", payment)
  // Handle incomplete payment - could show UI to user
  return payment.identifier
}

// Singleton instances
export const piNetwork = new PiNetworkService()
export const piSocial = piNetwork // Alias for social features
