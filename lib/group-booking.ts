// Group Booking and Cost Splitting System

export interface GroupBooking {
  groupId: string
  propertyId: string
  propertyTitle: string
  organizerId: string
  organizerName: string
  totalCost: number
  checkIn: Date
  checkOut: Date
  status: "draft" | "pending" | "confirmed" | "cancelled"
  participants: GroupParticipant[]
  createdAt: Date
  confirmedAt?: Date
}

export interface GroupParticipant {
  userId: string
  username: string
  email: string
  shareAmount: number
  paymentStatus: "pending" | "paid" | "refunded"
  joinedAt: Date
  paidAt?: Date
  piTransactionHash?: string
}

export interface PartyPlannerProfile {
  plannerId: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  specialties: string[]
  priceRange: {
    min: number
    max: number
  }
  portfolio: PortfolioItem[]
  verified: boolean
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  eventType: string
  guestCount: number
  date: Date
}

export interface SharedWishlist {
  wishlistId: string
  name: string
  ownerId: string
  ownerName: string
  collaborators: WishlistCollaborator[]
  properties: WishlistProperty[]
  createdAt: Date
  isPublic: boolean
}

export interface WishlistCollaborator {
  userId: string
  username: string
  role: "viewer" | "editor"
  addedAt: Date
}

export interface WishlistProperty {
  propertyId: string
  addedBy: string
  addedAt: Date
  notes?: string
  votes: PropertyVote[]
}

export interface PropertyVote {
  userId: string
  vote: "up" | "down"
  votedAt: Date
}

export interface EventGallery {
  galleryId: string
  bookingId: string
  propertyId: string
  propertyTitle: string
  eventDate: Date
  uploadedBy: string
  photos: GalleryPhoto[]
  isPublic: boolean
  likes: number
  views: number
}

export interface GalleryPhoto {
  photoId: string
  url: string
  caption?: string
  uploadedAt: Date
  likes: number
}

export class GroupBookingManager {
  // Create a new group booking
  static createGroupBooking(params: {
    propertyId: string
    propertyTitle: string
    organizerId: string
    organizerName: string
    totalCost: number
    checkIn: Date
    checkOut: Date
  }): GroupBooking {
    const groupId = `GRP-${Date.now()}`

    const booking: GroupBooking = {
      groupId,
      propertyId: params.propertyId,
      propertyTitle: params.propertyTitle,
      organizerId: params.organizerId,
      organizerName: params.organizerName,
      totalCost: params.totalCost,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      status: "draft",
      participants: [],
      createdAt: new Date(),
    }

    console.log("[v0] Group booking created:", booking)
    return booking
  }

  // Add participant to group booking
  static addParticipant(
    booking: GroupBooking,
    participant: Omit<GroupParticipant, "joinedAt" | "paymentStatus">
  ): GroupBooking {
    const newParticipant: GroupParticipant = {
      ...participant,
      paymentStatus: "pending",
      joinedAt: new Date(),
    }

    return {
      ...booking,
      participants: [...booking.participants, newParticipant],
    }
  }

  // Calculate equal split
  static splitEqually(totalCost: number, participantCount: number): number[] {
    const baseAmount = Math.floor((totalCost / participantCount) * 100) / 100
    const remainder = totalCost - baseAmount * participantCount
    
    const splits = Array(participantCount).fill(baseAmount)
    if (remainder > 0) {
      splits[0] += remainder // Add remainder to organizer
    }
    
    return splits
  }

  // Calculate custom split
  static splitCustom(
    totalCost: number,
    percentages: number[]
  ): { amounts: number[]; valid: boolean } {
    const totalPercentage = percentages.reduce((sum, p) => sum + p, 0)
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return { amounts: [], valid: false }
    }

    const amounts = percentages.map((p) => 
      Math.round((totalCost * p) / 100 * 100) / 100
    )

    return { amounts, valid: true }
  }

  // Process payment for participant
  static async processParticipantPayment(
    booking: GroupBooking,
    userId: string,
    piTransactionHash: string
  ): Promise<GroupBooking> {
    const updatedParticipants = booking.participants.map((p) => {
      if (p.userId === userId) {
        return {
          ...p,
          paymentStatus: "paid" as const,
          paidAt: new Date(),
          piTransactionHash,
        }
      }
      return p
    })

    const allPaid = updatedParticipants.every((p) => p.paymentStatus === "paid")

    return {
      ...booking,
      participants: updatedParticipants,
      status: allPaid ? "confirmed" : booking.status,
      confirmedAt: allPaid ? new Date() : booking.confirmedAt,
    }
  }

  // Check if booking is ready for confirmation
  static canConfirmBooking(booking: GroupBooking): boolean {
    if (booking.participants.length === 0) return false
    return booking.participants.every((p) => p.paymentStatus === "paid")
  }
}

export class PartyPlannerMatcher {
  // Find party planners based on criteria
  static searchPlanners(criteria: {
    budget?: number
    specialties?: string[]
    minRating?: number
  }): PartyPlannerProfile[] {
    // Mock data for demonstration
    const mockPlanners: PartyPlannerProfile[] = [
      {
        plannerId: "planner-1",
        name: "Sarah's Event Planning",
        avatar: "/placeholder.svg",
        rating: 4.9,
        reviewCount: 127,
        specialties: ["Birthday Parties", "Corporate Events", "Weddings"],
        priceRange: { min: 0.000637, max: 0.003182 },
        portfolio: [],
        verified: true,
      },
      {
        plannerId: "planner-2",
        name: "Epic Party Productions",
        avatar: "/placeholder.svg",
        rating: 4.7,
        reviewCount: 89,
        specialties: ["DJ Services", "Light Shows", "Theme Parties"],
        priceRange: { min: 0.000955, max: 0.004773 },
        portfolio: [],
        verified: true,
      },
    ]

    let filtered = mockPlanners

    if (criteria.budget) {
      filtered = filtered.filter((p) => p.priceRange.min <= criteria.budget!)
    }

    if (criteria.minRating) {
      filtered = filtered.filter((p) => p.rating >= criteria.minRating!)
    }

    if (criteria.specialties && criteria.specialties.length > 0) {
      filtered = filtered.filter((p) =>
        criteria.specialties!.some((s) => p.specialties.includes(s))
      )
    }

    return filtered
  }
}

export class WishlistManager {
  // Create shared wishlist
  static createSharedWishlist(
    ownerId: string,
    ownerName: string,
    name: string,
    isPublic: boolean
  ): SharedWishlist {
    const wishlistId = `WISH-${Date.now()}`

    return {
      wishlistId,
      name,
      ownerId,
      ownerName,
      collaborators: [],
      properties: [],
      createdAt: new Date(),
      isPublic,
    }
  }

  // Add property to wishlist
  static addPropertyToWishlist(
    wishlist: SharedWishlist,
    propertyId: string,
    userId: string,
    notes?: string
  ): SharedWishlist {
    const property: WishlistProperty = {
      propertyId,
      addedBy: userId,
      addedAt: new Date(),
      notes,
      votes: [],
    }

    return {
      ...wishlist,
      properties: [...wishlist.properties, property],
    }
  }

  // Vote on property
  static voteOnProperty(
    wishlist: SharedWishlist,
    propertyId: string,
    userId: string,
    vote: "up" | "down"
  ): SharedWishlist {
    const updatedProperties = wishlist.properties.map((prop) => {
      if (prop.propertyId === propertyId) {
        const existingVoteIndex = prop.votes.findIndex((v) => v.userId === userId)
        let newVotes = [...prop.votes]

        if (existingVoteIndex >= 0) {
          newVotes[existingVoteIndex] = { userId, vote, votedAt: new Date() }
        } else {
          newVotes.push({ userId, vote, votedAt: new Date() })
        }

        return { ...prop, votes: newVotes }
      }
      return prop
    })

    return {
      ...wishlist,
      properties: updatedProperties,
    }
  }

  // Get top voted properties
  static getTopVoted(wishlist: SharedWishlist, limit: number = 5): WishlistProperty[] {
    return [...wishlist.properties]
      .sort((a, b) => {
        const aScore = a.votes.filter((v) => v.vote === "up").length
        const bScore = b.votes.filter((v) => v.vote === "up").length
        return bScore - aScore
      })
      .slice(0, limit)
  }
}

// Storage
export const groupBookingStorage = new Map<string, GroupBooking>()
export const wishlistStorage = new Map<string, SharedWishlist>()
export const eventGalleryStorage = new Map<string, EventGallery>()
