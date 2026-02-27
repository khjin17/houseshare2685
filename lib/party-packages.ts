// Party Package and Event Management System

export type PackageType = "basic" | "standard" | "premium" | "luxury"

export interface PartyPackage {
  id: string
  name: string
  type: PackageType
  description: string
  price: number // in Pi
  includes: string[]
  icon: string
}

export interface CleaningService {
  id: string
  name: string
  description: string
  price: number // in Pi
  estimatedTime: string
}

export interface NoiseDeposit {
  propertyId: string
  bookingId: string
  amount: number // in Pi
  status: "pending" | "held" | "returned" | "forfeited"
  returnDate?: Date
  reason?: string
}

export interface GuestPricing {
  baseGuests: number
  maxGuests: number
  pricePerExtraGuest: number // in Pi
}

export const partyPackages: PartyPackage[] = [
  {
    id: "pkg-basic",
    name: "Basic Party Package",
    type: "basic",
    description: "Essential equipment for a small gathering",
    price: 0.000159,
    includes: [
      "Bluetooth Speaker",
      "Basic LED Lighting",
      "Party Decorations Kit",
      "Disposable Tableware (20 people)",
    ],
    icon: "🎈",
  },
  {
    id: "pkg-standard",
    name: "Standard Party Package",
    type: "standard",
    description: "Everything you need for a memorable party",
    price: 0.000477,
    includes: [
      "Professional Sound System",
      "RGB Smart Lighting",
      "Karaoke Machine",
      "Party Decorations Deluxe Kit",
      "Disposable Tableware (50 people)",
      "Beverage Coolers",
    ],
    icon: "🎉",
  },
  {
    id: "pkg-premium",
    name: "Premium Party Package",
    type: "premium",
    description: "Full party setup with catering support",
    price: 0.000955,
    includes: [
      "DJ Equipment Set",
      "Professional Stage Lighting",
      "Smoke Machine",
      "Photo Booth with Props",
      "Premium Decorations",
      "Tableware for 100 people",
      "Beverage Station Setup",
      "Ice Machine",
    ],
    icon: "🎊",
  },
  {
    id: "pkg-luxury",
    name: "Luxury Party Package",
    type: "luxury",
    description: "Ultimate party experience with full service",
    price: 0.001591,
    includes: [
      "Professional DJ Service (4 hours)",
      "Complete Light Show Setup",
      "Photo & Video Booth",
      "Premium Catering Service",
      "Bartender Service (4 hours)",
      "Event Coordinator",
      "Luxury Decorations & Setup",
      "Full Cleanup Service",
      "Security Staff (2 personnel)",
    ],
    icon: "💎",
  },
]

export const cleaningServices: CleaningService[] = [
  {
    id: "clean-basic",
    name: "Basic Post-Party Cleanup",
    description: "Trash removal and basic tidying",
    price: 0.000095,
    estimatedTime: "1-2 hours",
  },
  {
    id: "clean-standard",
    name: "Standard Deep Cleaning",
    description: "Complete cleaning including floors, surfaces, and bathrooms",
    price: 0.000255,
    estimatedTime: "2-3 hours",
  },
  {
    id: "clean-premium",
    name: "Premium Full Service",
    description: "Professional cleaning team with all equipment",
    price: 0.000477,
    estimatedTime: "3-4 hours",
  },
]

export class PartyServiceManager {
  // Calculate noise deposit based on property value and guest count
  static calculateNoiseDeposit(propertyPrice: number, guestCount: number): number {
    const baseDeposit = propertyPrice * 0.2 // 20% of nightly rate
    const guestMultiplier = Math.floor(guestCount / 10) * 10 // +10 Pi per 10 guests
    return Math.max(50, baseDeposit + guestMultiplier) // Minimum 50 Pi
  }

  // Calculate extra guest charges
  static calculateExtraGuestFee(
    baseGuests: number,
    actualGuests: number,
    pricePerExtra: number
  ): number {
    const extraGuests = Math.max(0, actualGuests - baseGuests)
    return extraGuests * pricePerExtra
  }

  // Calculate total party booking cost
  static calculateTotalCost(params: {
    propertyPrice: number
    nights: number
    selectedPackage?: PartyPackage
    cleaningService?: CleaningService
    baseGuests: number
    actualGuests: number
    pricePerExtraGuest: number
    includeNoiseDeposit: boolean
  }): {
    propertyTotal: number
    packageTotal: number
    cleaningTotal: number
    extraGuestTotal: number
    noiseDeposit: number
    subtotal: number
    platformFee: number
    total: number
  } {
    const propertyTotal = params.propertyPrice * params.nights
    const packageTotal = params.selectedPackage?.price || 0
    const cleaningTotal = params.cleaningService?.price || 0
    const extraGuestTotal = this.calculateExtraGuestFee(
      params.baseGuests,
      params.actualGuests,
      params.pricePerExtraGuest
    )
    const noiseDeposit = params.includeNoiseDeposit
      ? this.calculateNoiseDeposit(params.propertyPrice, params.actualGuests)
      : 0

    const subtotal = propertyTotal + packageTotal + cleaningTotal + extraGuestTotal
    const platformFee = subtotal * 0.05 // 5% platform fee
    const total = subtotal + platformFee + noiseDeposit

    return {
      propertyTotal,
      packageTotal,
      cleaningTotal,
      extraGuestTotal,
      noiseDeposit,
      subtotal,
      platformFee,
      total,
    }
  }

  // Process noise deposit return
  static async processNoiseDepositReturn(
    deposit: NoiseDeposit,
    hasViolation: boolean,
    violationReason?: string
  ): Promise<NoiseDeposit> {
    if (hasViolation) {
      return {
        ...deposit,
        status: "forfeited",
        reason: violationReason,
      }
    }

    return {
      ...deposit,
      status: "returned",
      returnDate: new Date(),
    }
  }
}

// Mock storage for noise deposits
export const noiseDepositStorage = new Map<string, NoiseDeposit>()
