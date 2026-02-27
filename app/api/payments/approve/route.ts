import { NextRequest, NextResponse } from "next/server"
import { calculatePaymentBreakdown } from "@/lib/pi-network"

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json()

    console.log("[v0] Approving payment:", paymentId)

    // In production, you would:
    // 1. Verify the payment with Pi Network backend API
    // 2. Check if the property is still available
    // 3. Store the payment in your database
    // 4. Calculate and record the 5% commission

    // Mock approval
    const approved = true

    if (approved) {
      return NextResponse.json({
        success: true,
        paymentId,
        message: "Payment approved",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Payment approval failed",
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[v0] Payment approval error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
