"use client"

// Safety & Security Features

export interface EmergencyContact {
  contactId: string
  name: string
  relationship: string
  phone: string
  email: string
  isPrimary: boolean
}

export interface SafetyCheckIn {
  checkInId: string
  bookingId: string
  userId: string
  propertyId: string
  scheduledTime: Date
  status: "pending" | "confirmed" | "missed" | "emergency"
  confirmedAt?: Date
  emergencyTriggered?: boolean
  emergencyResponse?: EmergencyResponse
}

export interface EmergencyResponse {
  responseId: string
  checkInId: string
  triggeredAt: Date
  notifiedContacts: string[]
  localAuthoritiesNotified: boolean
  status: "active" | "resolved" | "false-alarm"
  resolvedAt?: Date
  notes?: string
}

export interface PropertyInsurance {
  insuranceId: string
  propertyId: string
  bookingId: string
  coverage: {
    propertyDamage: number
    liabilityLimit: number
    medicalExpenses: number
    partyIncidents: boolean
  }
  premium: number // in Pi
  policyNumber: string
  validFrom: Date
  validUntil: Date
  status: "active" | "expired" | "claimed"
}

export interface IdentityVerification {
  verificationId: string
  userId: string
  method: "government-id" | "selfie" | "pi-kyc" | "video-call"
  status: "pending" | "verified" | "failed" | "expired"
  verifiedAt?: Date
  expiresAt?: Date
  verificationLevel: "basic" | "intermediate" | "advanced"
  documentType?: string
  documentNumber?: string
}

export interface SafetyRating {
  propertyId: string
  overallScore: number // 0-100
  categories: {
    fireSafety: number
    security: number
    emergencyEquipment: number
    structuralSafety: number
    neighborhoodSafety: number
  }
  certifications: string[]
  lastInspection: Date
  nextInspection: Date
}

export interface SecurityFeature {
  featureId: string
  type: "smart-lock" | "camera" | "alarm" | "security-guard" | "safe" | "emergency-button"
  name: string
  description: string
  active: boolean
  monitoringType: "24/7" | "on-demand" | "self-monitored"
}

export class SafetySecurityManager {
  private emergencyContacts: Map<string, EmergencyContact[]> = new Map()
  private safetyCheckIns: Map<string, SafetyCheckIn> = new Map()
  private insurancePolicies: Map<string, PropertyInsurance> = new Map()
  private identityVerifications: Map<string, IdentityVerification> = new Map()
  private emergencyNetwork: Map<string, string> = new Map() // userId -> emergency contact number

  // Emergency Contact Management
  async addEmergencyContact(
    userId: string,
    contact: Omit<EmergencyContact, "contactId">
  ): Promise<EmergencyContact> {
    const contactId = `EC-${Date.now()}`
    
    const emergencyContact: EmergencyContact = {
      contactId,
      ...contact
    }

    const userContacts = this.emergencyContacts.get(userId) || []
    
    // If this is primary, remove primary from others
    if (contact.isPrimary) {
      userContacts.forEach(c => c.isPrimary = false)
    }
    
    userContacts.push(emergencyContact)
    this.emergencyContacts.set(userId, userContacts)

    console.log("[v0] Emergency contact added:", emergencyContact)
    return emergencyContact
  }

  getUserEmergencyContacts(userId: string): EmergencyContact[] {
    return this.emergencyContacts.get(userId) || []
  }

  // Real-time Safety Check-in
  async scheduleCheckIn(
    bookingId: string,
    userId: string,
    propertyId: string,
    scheduledTime: Date
  ): Promise<SafetyCheckIn> {
    const checkInId = `CHK-${Date.now()}`
    
    const checkIn: SafetyCheckIn = {
      checkInId,
      bookingId,
      userId,
      propertyId,
      scheduledTime,
      status: "pending"
    }

    this.safetyCheckIns.set(checkInId, checkIn)
    console.log("[v0] Safety check-in scheduled:", checkIn)

    // Schedule automatic check after 2 hours
    setTimeout(() => {
      this.verifyCheckIn(checkInId)
    }, 2 * 60 * 60 * 1000)

    return checkIn
  }

  async confirmCheckIn(checkInId: string): Promise<void> {
    const checkIn = this.safetyCheckIns.get(checkInId)
    if (!checkIn) return

    checkIn.status = "confirmed"
    checkIn.confirmedAt = new Date()
    
    console.log("[v0] Safety check-in confirmed:", checkInId)
  }

  private async verifyCheckIn(checkInId: string): Promise<void> {
    const checkIn = this.safetyCheckIns.get(checkInId)
    if (!checkIn) return

    if (checkIn.status === "pending") {
      // Check-in missed, trigger emergency response
      checkIn.status = "missed"
      await this.triggerEmergencyResponse(checkInId)
    }
  }

  async triggerEmergencyResponse(checkInId: string): Promise<EmergencyResponse> {
    const checkIn = this.safetyCheckIns.get(checkInId)
    if (!checkIn) throw new Error("Check-in not found")

    checkIn.status = "emergency"
    checkIn.emergencyTriggered = true

    const responseId = `ER-${Date.now()}`
    
    // Get emergency contacts
    const contacts = this.getUserEmergencyContacts(checkIn.userId)
    const notifiedContacts = contacts.map(c => c.phone)

    const response: EmergencyResponse = {
      responseId,
      checkInId,
      triggeredAt: new Date(),
      notifiedContacts,
      localAuthoritiesNotified: true,
      status: "active"
    }

    checkIn.emergencyResponse = response

    console.log("[v0] EMERGENCY RESPONSE TRIGGERED:", response)
    
    // In production: send SMS/push notifications to contacts
    // Call local emergency services
    // Alert host and platform support

    return response
  }

  // Insurance Integration
  async purchaseInsurance(
    propertyId: string,
    bookingId: string,
    coverage: PropertyInsurance["coverage"],
    duration: number // days
  ): Promise<PropertyInsurance> {
    const insuranceId = `INS-${Date.now()}`
    
    // Calculate premium based on coverage
    const basePremium = 20 // Pi
    const coverageMultiplier = 
      (coverage.propertyDamage / 1000) * 0.01 +
      (coverage.liabilityLimit / 10000) * 0.01 +
      (coverage.medicalExpenses / 1000) * 0.01 +
      (coverage.partyIncidents ? 15 : 0)
    
    const premium = Math.round((basePremium + coverageMultiplier) * duration)

    const validFrom = new Date()
    const validUntil = new Date(validFrom.getTime() + duration * 24 * 60 * 60 * 1000)

    const insurance: PropertyInsurance = {
      insuranceId,
      propertyId,
      bookingId,
      coverage,
      premium,
      policyNumber: `POL-${Date.now()}`,
      validFrom,
      validUntil,
      status: "active"
    }

    this.insurancePolicies.set(insuranceId, insurance)
    console.log("[v0] Insurance policy created:", insurance)

    return insurance
  }

  getInsurancePolicy(insuranceId: string): PropertyInsurance | undefined {
    return this.insurancePolicies.get(insuranceId)
  }

  // Identity Verification
  async initiateVerification(
    userId: string,
    method: IdentityVerification["method"]
  ): Promise<IdentityVerification> {
    const verificationId = `VER-${Date.now()}`
    
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1) // Valid for 1 year

    const verification: IdentityVerification = {
      verificationId,
      userId,
      method,
      status: "pending",
      verificationLevel: "basic",
      expiresAt
    }

    this.identityVerifications.set(verificationId, verification)
    console.log("[v0] Identity verification initiated:", verification)

    return verification
  }

  async completeVerification(
    verificationId: string,
    documentType: string,
    documentNumber: string
  ): Promise<void> {
    const verification = this.identityVerifications.get(verificationId)
    if (!verification) return

    verification.status = "verified"
    verification.verifiedAt = new Date()
    verification.documentType = documentType
    verification.documentNumber = documentNumber

    // Determine verification level based on method
    if (verification.method === "video-call") {
      verification.verificationLevel = "advanced"
    } else if (verification.method === "pi-kyc") {
      verification.verificationLevel = "intermediate"
    }

    console.log("[v0] Identity verification completed:", verification)
  }

  getUserVerification(userId: string): IdentityVerification | null {
    for (const verification of this.identityVerifications.values()) {
      if (verification.userId === userId && verification.status === "verified") {
        return verification
      }
    }
    return null
  }

  // Safety Rating System
  calculateSafetyRating(propertyId: string, features: {
    hasFireExtinguisher: boolean
    hasSmokeDetector: boolean
    hasFirstAidKit: boolean
    hasSecurityCamera: boolean
    hasSmartLock: boolean
    hasAlarmSystem: boolean
    neighborhoodCrimeRate: "low" | "medium" | "high"
    structureAge: number
    lastInspectionDate: Date
  }): SafetyRating {
    let fireSafety = 0
    if (features.hasFireExtinguisher) fireSafety += 40
    if (features.hasSmokeDetector) fireSafety += 40
    if (features.hasFirstAidKit) fireSafety += 20

    let security = 0
    if (features.hasSecurityCamera) security += 35
    if (features.hasSmartLock) security += 35
    if (features.hasAlarmSystem) security += 30

    const emergencyEquipment = (fireSafety + (features.hasFirstAidKit ? 20 : 0)) / 1.2

    const structuralSafety = features.structureAge < 10 ? 90 : 
                             features.structureAge < 30 ? 70 : 50

    const neighborhoodSafety = 
      features.neighborhoodCrimeRate === "low" ? 90 :
      features.neighborhoodCrimeRate === "medium" ? 60 : 30

    const overallScore = Math.round(
      (fireSafety + security + emergencyEquipment + structuralSafety + neighborhoodSafety) / 5
    )

    const certifications = []
    if (overallScore >= 80) certifications.push("Safety Certified")
    if (fireSafety >= 90) certifications.push("Fire Safety Approved")
    if (security >= 90) certifications.push("Security Verified")

    const nextInspection = new Date(features.lastInspectionDate)
    nextInspection.setMonth(nextInspection.getMonth() + 6)

    return {
      propertyId,
      overallScore,
      categories: {
        fireSafety,
        security,
        emergencyEquipment,
        structuralSafety,
        neighborhoodSafety
      },
      certifications,
      lastInspection: features.lastInspectionDate,
      nextInspection
    }
  }

  // Security Features
  getPropertySecurityFeatures(): SecurityFeature[] {
    return [
      {
        featureId: "sf-1",
        type: "smart-lock",
        name: "Smart Lock Access",
        description: "Keyless entry with temporary access codes",
        active: true,
        monitoringType: "self-monitored"
      },
      {
        featureId: "sf-2",
        type: "camera",
        name: "Security Cameras",
        description: "24/7 monitoring of entrance and common areas",
        active: true,
        monitoringType: "24/7"
      },
      {
        featureId: "sf-3",
        type: "alarm",
        name: "Security Alarm System",
        description: "Motion-activated alarm with emergency dispatch",
        active: true,
        monitoringType: "24/7"
      },
      {
        featureId: "sf-4",
        type: "emergency-button",
        name: "Emergency Panic Button",
        description: "Direct line to local emergency services",
        active: true,
        monitoringType: "on-demand"
      },
      {
        featureId: "sf-5",
        type: "safe",
        name: "In-Room Safe",
        description: "Secure storage for valuables",
        active: true,
        monitoringType: "self-monitored"
      }
    ]
  }

  // Automated Emergency Network
  registerEmergencyNetwork(userId: string, phone: string): void {
    this.emergencyNetwork.set(userId, phone)
    console.log("[v0] User registered in emergency network:", userId)
  }

  async broadcastEmergency(userId: string, location: string, situation: string): Promise<void> {
    const contacts = this.getUserEmergencyContacts(userId)
    
    console.log("[v0] BROADCASTING EMERGENCY:", {
      userId,
      location,
      situation,
      notifying: contacts.length
    })

    // In production:
    // - Send SMS to all emergency contacts
    // - Notify local authorities
    // - Alert property host
    // - Dispatch security if available
    // - Send push notifications to app
  }
}

// Default safety recommendations
export const safetyRecommendations = [
  "Share your booking details with trusted contacts",
  "Verify host identity before check-in",
  "Check smoke detectors upon arrival",
  "Locate emergency exits immediately",
  "Keep emergency numbers saved",
  "Use the safety check-in feature",
  "Review property safety rating",
  "Consider travel insurance for peace of mind"
]

// Export singleton
export const safetySecurityManager = new SafetySecurityManager()
