export interface Booking {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  location: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: "upcoming" | "completed" | "cancelled" | "confirmed"
  hostName: string
  rating?: number
}
