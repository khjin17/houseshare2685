import { NextRequest, NextResponse } from "next/server"
import { calculatePaymentBreakdown, PLATFORM_COMMISSION_RATE } from "@/lib/pi-network"

export async function POST(request: NextRequest) {
  try {
    const { paymentId, txid } = await request.json()

    console.log("[v0] Completing payment:", paymentId, txid)

    // In production, you would:
    // 1. Verify the transaction with Pi Network backend API
    // 2. Update booking status to confirmed
    // 3. Transfer funds: deduct 5% commission, send rest to host
    // 4. Create booking record in database
    // 5. Send confirmation emails/notifications

    // Example payment breakdown logging
    const mockPaymentAmount = 100 // This would come from your database
    const breakdown = calculatePaymentBreakdown(mockPaymentAmount)

    console.log("[v0] Payment breakdown:")
    console.log(`  - Total amount: π ${breakdown.totalAmount}`)
    console.log(`  - Platform commission (${PLATFORM_COMMISSION_RATE * 100}%): π ${breakdown.platformFee}`)
    console.log(`  - Host receives: π ${breakdown.hostAmount}`)

    // Mock completion
    const completed = true

    if (completed) {
      return NextResponse.json({
        success: true,
        paymentId,
        txid,
        message: "Payment completed successfully",
        breakdown,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Payment completion failed",
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[v0] Payment completion error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
