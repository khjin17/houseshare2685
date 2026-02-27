// Favorites management using localStorage

export interface FavoriteProperty {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  hostId: string
  addedAt: Date
}

const FAVORITES_KEY = "houseshare_favorites"

export const favoritesManager = {
  // Get all favorites
  getAll(): FavoriteProperty[] {
    if (typeof window === "undefined") return []
    
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (!stored) return []
      
      const favorites = JSON.parse(stored)
      return favorites.map((fav: any) => ({
        ...fav,
        addedAt: new Date(fav.addedAt),
      }))
    } catch (error) {
      console.error("[v0] Failed to get favorites:", error)
      return []
    }
  },

  // Add a property to favorites
  add(property: Omit<FavoriteProperty, "addedAt">): void {
    if (typeof window === "undefined") return
    
    try {
      const favorites = this.getAll()
      
      // Check if already exists
      if (favorites.some(fav => fav.id === property.id)) {
        console.log("[v0] Property already in favorites:", property.id)
        return
      }
      
      const newFavorite: FavoriteProperty = {
        ...property,
        addedAt: new Date(),
      }
      
      favorites.push(newFavorite)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      console.log("[v0] Added to favorites:", property.id)
    } catch (error) {
      console.error("[v0] Failed to add favorite:", error)
    }
  },

  // Remove a property from favorites
  remove(propertyId: string): void {
    if (typeof window === "undefined") return
    
    try {
      const favorites = this.getAll()
      const filtered = favorites.filter(fav => fav.id !== propertyId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
      console.log("[v0] Removed from favorites:", propertyId)
    } catch (error) {
      console.error("[v0] Failed to remove favorite:", error)
    }
  },

  // Check if a property is favorited
  isFavorite(propertyId: string): boolean {
    if (typeof window === "undefined") return false
    
    const favorites = this.getAll()
    return favorites.some(fav => fav.id === propertyId)
  },

  // Toggle favorite status
  toggle(property: Omit<FavoriteProperty, "addedAt">): boolean {
    const isFav = this.isFavorite(property.id)
    
    if (isFav) {
      this.remove(property.id)
      return false
    } else {
      this.add(property)
      return true
    }
  },
}
