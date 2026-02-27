"use client"

// Social & Group Booking Features
import { piSocial } from "@/lib/pi-social"

export interface GroupBooking {
  groupId: string
  propertyId: string
  propertyTitle: string
  organizerId: string
  organizerName: string
  members: GroupMember[]
  totalCost: number
  costPerPerson: number
  bookingDates: {
    checkIn: Date
    checkOut: Date
  }
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: Map<string, PaymentStatus>
  createdAt: Date
  confirmedAt?: Date
}

export interface GroupMember {
  userId: string
  username: string
  email: string
  status: "invited" | "joined" | "declined" | "paid"
  share: number // amount in Pi
  paidAt?: Date
  joinedAt?: Date
}

export interface PaymentStatus {
  userId: string
  amount: number
  status: "pending" | "paid" | "refunded"
  paidAt?: Date
  transactionId?: string
}

export interface SharedWishlist {
  wishlistId: string
  name: string
  createdBy: string
  sharedWith: string[]
  properties: WishlistProperty[]
  visibility: "private" | "friends" | "public"
  createdAt: Date
  updatedAt: Date
}

export interface WishlistProperty {
  propertyId: string
  addedBy: string
  addedAt: Date
  votes: Map<string, number> // userId -> vote (1-5)
  comments: WishlistComment[]
}

export interface WishlistComment {
  commentId: string
  userId: string
  username: string
  text: string
  timestamp: Date
}

export interface PartyPlanner {
  plannerId: string
  name: string
  bio: string
  avatar: string
  rating: number
  reviewCount: number
  specialties: string[]
  hourlyRate: number // in Pi
  portfolio: string[]
  availability: boolean
  completedEvents: number
}

export interface EventGallery {
  galleryId: string
  propertyId: string
  bookingId: string
  hostedBy: string
  eventType: string
  photos: GalleryPhoto[]
  visibility: "private" | "shared" | "public"
  likes: string[]
  createdAt: Date
}

export interface GalleryPhoto {
  photoId: string
  url: string
  uploadedBy: string
  caption?: string
  timestamp: Date
  tags: string[]
}

export class SocialBookingManager {
  private groupBookings: Map<string, GroupBooking> = new Map()
  private wishlists: Map<string, SharedWishlist> = new Map()
  private galleries: Map<string, EventGallery> = new Map()

  // Group Booking with Cost Splitting
  async createGroupBooking(
    propertyId: string,
    propertyTitle: string,
    organizerId: string,
    organizerName: string,
    totalCost: number,
    memberEmails: string[],
    bookingDates: { checkIn: Date; checkOut: Date }
  ): Promise<GroupBooking> {
    const groupId = `GRP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const memberCount = memberEmails.length + 1 // +1 for organizer
    const costPerPerson = Math.round((totalCost / memberCount) * 100) / 100

    const members: GroupMember[] = [
      {
        userId: organizerId,
        username: organizerName,
        email: "",
        status: "joined",
        share: costPerPerson,
        joinedAt: new Date()
      },
      ...memberEmails.map(email => ({
        userId: `temp-${email}`,
        username: email.split('@')[0],
        email,
        status: "invited" as const,
        share: costPerPerson
      }))
    ]

    const paymentStatus = new Map<string, PaymentStatus>()
    members.forEach(member => {
      paymentStatus.set(member.userId, {
        userId: member.userId,
        amount: costPerPerson,
        status: "pending"
      })
    })

    const groupBooking: GroupBooking = {
      groupId,
      propertyId,
      propertyTitle,
      organizerId,
      organizerName,
      members,
      totalCost,
      costPerPerson,
      bookingDates,
      status: "pending",
      paymentStatus,
      createdAt: new Date()
    }

    this.groupBookings.set(groupId, groupBooking)
    console.log("[v0] Group booking created:", groupBooking)

    // Send invitations to members
    await this.sendGroupInvitations(groupId, memberEmails)

    return groupBooking
  }

  private async sendGroupInvitations(groupId: string, emails: string[]): Promise<void> {
    // Mock invitation system
    console.log("[v0] Sending invitations to:", emails)
    // In production: send emails via API
  }

  async acceptGroupInvitation(groupId: string, userId: string): Promise<void> {
    const booking = this.groupBookings.get(groupId)
    if (!booking) throw new Error("Group booking not found")

    const member = booking.members.find(m => m.userId === userId)
    if (!member) throw new Error("User not in group")

    member.status = "joined"
    member.joinedAt = new Date()
    
    console.log("[v0] User joined group:", { groupId, userId })
  }

  async processGroupPayment(groupId: string, userId: string, amount: number): Promise<void> {
    const booking = this.groupBookings.get(groupId)
    if (!booking) throw new Error("Group booking not found")

    const payment = booking.paymentStatus.get(userId)
    if (!payment) throw new Error("Payment record not found")

    payment.status = "paid"
    payment.paidAt = new Date()
    payment.transactionId = `TXN-${Date.now()}`

    // Update member status
    const member = booking.members.find(m => m.userId === userId)
    if (member) {
      member.status = "paid"
      member.paidAt = new Date()
    }

    console.log("[v0] Group payment processed:", { groupId, userId, amount })

    // Check if all members have paid
    const allPaid = Array.from(booking.paymentStatus.values()).every(p => p.status === "paid")
    if (allPaid) {
      booking.status = "confirmed"
      booking.confirmedAt = new Date()
      console.log("[v0] Group booking confirmed - all payments received")
    }
  }

  getGroupBooking(groupId: string): GroupBooking | undefined {
    return this.groupBookings.get(groupId)
  }

  getUserGroupBookings(userId: string): GroupBooking[] {
    return Array.from(this.groupBookings.values()).filter(
      gb => gb.organizerId === userId || gb.members.some(m => m.userId === userId)
    )
  }

  // Shared Wishlist
  async createSharedWishlist(
    name: string,
    createdBy: string,
    sharedWith: string[],
    visibility: SharedWishlist["visibility"] = "friends"
  ): Promise<SharedWishlist> {
    const wishlistId = `WISH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const wishlist: SharedWishlist = {
      wishlistId,
      name,
      createdBy,
      sharedWith,
      properties: [],
      visibility,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.wishlists.set(wishlistId, wishlist)
    console.log("[v0] Shared wishlist created:", wishlist)
    return wishlist
  }

  async addToWishlist(
    wishlistId: string,
    propertyId: string,
    userId: string
  ): Promise<void> {
    const wishlist = this.wishlists.get(wishlistId)
    if (!wishlist) throw new Error("Wishlist not found")

    const property: WishlistProperty = {
      propertyId,
      addedBy: userId,
      addedAt: new Date(),
      votes: new Map(),
      comments: []
    }

    wishlist.properties.push(property)
    wishlist.updatedAt = new Date()
    console.log("[v0] Property added to wishlist:", { wishlistId, propertyId })
  }

  async voteOnProperty(
    wishlistId: string,
    propertyId: string,
    userId: string,
    vote: number
  ): Promise<void> {
    const wishlist = this.wishlists.get(wishlistId)
    if (!wishlist) throw new Error("Wishlist not found")

    const property = wishlist.properties.find(p => p.propertyId === propertyId)
    if (!property) throw new Error("Property not in wishlist")

    property.votes.set(userId, vote)
    console.log("[v0] Vote recorded:", { wishlistId, propertyId, userId, vote })
  }

  async commentOnProperty(
    wishlistId: string,
    propertyId: string,
    userId: string,
    username: string,
    text: string
  ): Promise<void> {
    const wishlist = this.wishlists.get(wishlistId)
    if (!wishlist) throw new Error("Wishlist not found")

    const property = wishlist.properties.find(p => p.propertyId === propertyId)
    if (!property) throw new Error("Property not in wishlist")

    const comment: WishlistComment = {
      commentId: `CMT-${Date.now()}`,
      userId,
      username,
      text,
      timestamp: new Date()
    }

    property.comments.push(comment)
    console.log("[v0] Comment added:", comment)
  }

  getSharedWishlist(wishlistId: string): SharedWishlist | undefined {
    return this.wishlists.get(wishlistId)
  }

  getUserWishlists(userId: string): SharedWishlist[] {
    return Array.from(this.wishlists.values()).filter(
      w => w.createdBy === userId || w.sharedWith.includes(userId)
    )
  }

  // Event Gallery
  async createEventGallery(
    propertyId: string,
    bookingId: string,
    hostedBy: string,
    eventType: string,
    visibility: EventGallery["visibility"] = "shared"
  ): Promise<EventGallery> {
    const galleryId = `GAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const gallery: EventGallery = {
      galleryId,
      propertyId,
      bookingId,
      hostedBy,
      eventType,
      photos: [],
      visibility,
      likes: [],
      createdAt: new Date()
    }

    this.galleries.set(galleryId, gallery)
    console.log("[v0] Event gallery created:", gallery)
    return gallery
  }

  async uploadPhotoToGallery(
    galleryId: string,
    uploadedBy: string,
    photoUrl: string,
    caption?: string,
    tags: string[] = []
  ): Promise<void> {
    const gallery = this.galleries.get(galleryId)
    if (!gallery) throw new Error("Gallery not found")

    const photo: GalleryPhoto = {
      photoId: `PHT-${Date.now()}`,
      url: photoUrl,
      uploadedBy,
      caption,
      timestamp: new Date(),
      tags
    }

    gallery.photos.push(photo)
    console.log("[v0] Photo uploaded to gallery:", photo)
  }

  async likeGallery(galleryId: string, userId: string): Promise<void> {
    const gallery = this.galleries.get(galleryId)
    if (!gallery) throw new Error("Gallery not found")

    if (!gallery.likes.includes(userId)) {
      gallery.likes.push(userId)
      console.log("[v0] Gallery liked:", { galleryId, userId })
    }
  }

  getEventGallery(galleryId: string): EventGallery | undefined {
    return this.galleries.get(galleryId)
  }

  getPropertyGalleries(propertyId: string): EventGallery[] {
    return Array.from(this.galleries.values()).filter(
      g => g.propertyId === propertyId && g.visibility === "public"
    )
  }
}

// Party Planner Matching
export const partyPlanners: PartyPlanner[] = [
  {
    plannerId: "planner-1",
    name: "Sarah Events",
    bio: "Professional event planner with 10+ years experience",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 156,
    specialties: ["Birthday Parties", "Corporate Events", "Weddings"],
    hourlyRate: 80,
    portfolio: [],
    availability: true,
    completedEvents: 234
  },
  {
    plannerId: "planner-2",
    name: "Party Pro Team",
    bio: "Full-service party planning and coordination",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 203,
    specialties: ["House Parties", "DJ Services", "Catering"],
    hourlyRate: 100,
    portfolio: [],
    availability: true,
    completedEvents: 312
  },
  {
    plannerId: "planner-3",
    name: "Elite Celebrations",
    bio: "Luxury event planning for special occasions",
    avatar: "/placeholder.svg",
    rating: 5.0,
    reviewCount: 89,
    specialties: ["Luxury Events", "VIP Parties", "Custom Themes"],
    hourlyRate: 150,
    portfolio: [],
    availability: true,
    completedEvents: 127
  }
]

export function matchPartyPlanner(eventType: string, budget: number): PartyPlanner[] {
  return partyPlanners
    .filter(p => p.hourlyRate <= budget && p.availability)
    .sort((a, b) => b.rating - a.rating)
}

// Export singleton instance
export const socialBookingManager = new SocialBookingManager()
