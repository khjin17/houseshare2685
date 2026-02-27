// Sustainability and Social Impact System

export interface EcoBadge {
  badgeId: string
  type: "solar" | "recycling" | "water-conservation" | "green-certified" | "local-sourced"
  name: string
  description: string
  verificationDate: Date
  verifiedBy: string
  icon: string
}

export interface CarbonOffset {
  offsetId: string
  bookingId: string
  propertyId: string
  estimatedEmissions: number // in kg CO2
  offsetAmount: number // in Pi
  offsetProject: string
  certificateUrl?: string
  createdAt: Date
}

export interface LocalBusinessPartner {
  partnerId: string
  name: string
  category: "restaurant" | "shop" | "service" | "attraction"
  distance: string
  discount: number
  description: string
  logo: string
  couponCode?: string
}

export interface SocialImpactDonation {
  donationId: string
  bookingId: string
  amount: number // in Pi
  cause: "education" | "environment" | "community" | "healthcare"
  organization: string
  transactionHash: string
  createdAt: Date
}

export interface PropertySustainabilityScore {
  propertyId: string
  overallScore: number // 0-100
  categories: {
    energy: number
    water: number
    waste: number
    materials: number
    community: number
  }
  badges: EcoBadge[]
  lastUpdated: Date
}

export const ecoBadgeTypes: Omit<EcoBadge, "badgeId" | "verificationDate" | "verifiedBy">[] = [
  {
    type: "solar",
    name: "Solar Powered",
    description: "Property uses solar energy for at least 50% of electricity needs",
    icon: "☀️",
  },
  {
    type: "recycling",
    name: "Comprehensive Recycling",
    description: "Full recycling program with composting and waste separation",
    icon: "♻️",
  },
  {
    type: "water-conservation",
    name: "Water Conservation",
    description: "Low-flow fixtures and rainwater harvesting system",
    icon: "💧",
  },
  {
    type: "green-certified",
    name: "Green Building Certified",
    description: "LEED or equivalent green building certification",
    icon: "🏆",
  },
  {
    type: "local-sourced",
    name: "Local Sourcing",
    description: "Amenities and supplies sourced from local businesses",
    icon: "🛒",
  },
]

export const carbonOffsetProjects = [
  {
    id: "reforestation-amazon",
    name: "Amazon Reforestation",
    description: "Plant trees in the Amazon rainforest",
    costPerKg: 0.02, // Pi per kg CO2
  },
  {
    id: "renewable-energy-india",
    name: "Renewable Energy - India",
    description: "Support solar panel installation in rural India",
    costPerKg: 0.015,
  },
  {
    id: "ocean-cleanup",
    name: "Ocean Plastic Cleanup",
    description: "Remove plastic from oceans and coastlines",
    costPerKg: 0.025,
  },
]

export class SustainabilityManager {
  // Calculate carbon footprint for a booking
  static calculateCarbonFootprint(params: {
    nights: number
    guests: number
    propertyType: "apartment" | "house" | "villa"
    hasHeating: boolean
    hasAC: boolean
  }): number {
    // Base emissions per night per guest (in kg CO2)
    const baseEmissions = 5

    let totalEmissions = params.nights * params.guests * baseEmissions

    // Property type multiplier
    const typeMultipliers = {
      apartment: 0.8,
      house: 1.0,
      villa: 1.3,
    }
    totalEmissions *= typeMultipliers[params.propertyType]

    // Heating/AC additions
    if (params.hasHeating) totalEmissions += params.nights * 2
    if (params.hasAC) totalEmissions += params.nights * 3

    return Math.round(totalEmissions * 10) / 10
  }

  // Calculate carbon offset cost
  static calculateOffsetCost(emissions: number, projectId: string): number {
    const project = carbonOffsetProjects.find((p) => p.id === projectId)
    if (!project) return 0

    return Math.round(emissions * project.costPerKg * 100) / 100
  }

  // Create carbon offset
  static async createCarbonOffset(
    bookingId: string,
    propertyId: string,
    emissions: number,
    projectId: string
  ): Promise<CarbonOffset> {
    const project = carbonOffsetProjects.find((p) => p.id === projectId)
    if (!project) throw new Error("Project not found")

    const offsetAmount = this.calculateOffsetCost(emissions, projectId)

    const offset: CarbonOffset = {
      offsetId: `OFFSET-${Date.now()}`,
      bookingId,
      propertyId,
      estimatedEmissions: emissions,
      offsetAmount,
      offsetProject: project.name,
      createdAt: new Date(),
    }

    console.log("[v0] Carbon offset created:", offset)
    return offset
  }

  // Calculate property sustainability score
  static calculateSustainabilityScore(params: {
    hasRenewableEnergy: boolean
    hasRecyclingProgram: boolean
    hasWaterConservation: boolean
    useEcoFriendlyProducts: boolean
    supportsLocalBusiness: boolean
    hasGreenCertification: boolean
    energyEfficiencyRating: number // 1-10
    wasteReductionScore: number // 1-10
  }): PropertySustainabilityScore {
    let energy = params.energyEfficiencyRating * 10
    if (params.hasRenewableEnergy) energy += 20

    let water = params.hasWaterConservation ? 80 : 40

    let waste = params.wasteReductionScore * 10
    if (params.hasRecyclingProgram) waste += 20

    let materials = params.useEcoFriendlyProducts ? 80 : 40

    let community = params.supportsLocalBusiness ? 80 : 40

    const overallScore = Math.round(
      (energy + water + waste + materials + community) / 5
    )

    const badges: EcoBadge[] = []
    if (params.hasRenewableEnergy) {
      badges.push({
        badgeId: `badge-${Date.now()}-1`,
        type: "solar",
        ...ecoBadgeTypes[0],
        verificationDate: new Date(),
        verifiedBy: "Green Certification Agency",
      })
    }
    if (params.hasRecyclingProgram) {
      badges.push({
        badgeId: `badge-${Date.now()}-2`,
        type: "recycling",
        ...ecoBadgeTypes[1],
        verificationDate: new Date(),
        verifiedBy: "Environmental Standards Board",
      })
    }

    return {
      propertyId: "",
      overallScore,
      categories: { energy, water, waste, materials, community },
      badges,
      lastUpdated: new Date(),
    }
  }

  // Process social impact donation
  static async processDonation(
    bookingId: string,
    amount: number,
    cause: SocialImpactDonation["cause"],
    organization: string
  ): Promise<SocialImpactDonation> {
    // Generate mock transaction hash
    const transactionHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`

    const donation: SocialImpactDonation = {
      donationId: `DONATE-${Date.now()}`,
      bookingId,
      amount,
      cause,
      organization,
      transactionHash,
      createdAt: new Date(),
    }

    console.log("[v0] Social impact donation processed:", donation)
    return donation
  }

  // Get local business partners
  static getLocalBusinesses(propertyLocation: string): LocalBusinessPartner[] {
    // Mock data - in production, query based on location
    return [
      {
        partnerId: "local-1",
        name: "Green Cafe",
        category: "restaurant",
        distance: "0.3 km",
        discount: 15,
        description: "Organic, locally-sourced menu",
        logo: "/placeholder.svg",
        couponCode: "HOUSESHARE15",
      },
      {
        partnerId: "local-2",
        name: "Eco Shop",
        category: "shop",
        distance: "0.5 km",
        discount: 10,
        description: "Sustainable products and zero-waste goods",
        logo: "/placeholder.svg",
        couponCode: "ECO10",
      },
      {
        partnerId: "local-3",
        name: "City Bike Rental",
        category: "service",
        distance: "0.2 km",
        discount: 20,
        description: "Eco-friendly transportation",
        logo: "/placeholder.svg",
        couponCode: "BIKE20",
      },
    ]
  }
}

// Storage
export const carbonOffsetStorage = new Map<string, CarbonOffset>()
export const donationStorage = new Map<string, SocialImpactDonation>()
export const sustainabilityScoreStorage = new Map<string, PropertySustainabilityScore>()

// Export manager instance for convenience
export const sustainabilityManager = SustainabilityManager
