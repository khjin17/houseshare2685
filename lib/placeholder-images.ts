// High-quality property images utility
// Uses curated realistic property photos

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', // Modern white house
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Contemporary home exterior
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', // Luxury living room
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', // Modern apartment building
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop', // Stylish bedroom
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', // Cozy interior
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop', // Modern kitchen
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', // Elegant living space
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop', // Contemporary bedroom
  'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop', // Luxury bathroom
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=600&fit=crop', // Modern house facade
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop', // Spacious living room
  'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop', // Minimalist apartment
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop', // Cozy bedroom
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&h=600&fit=crop', // Bright interior
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=600&fit=crop', // Luxury home exterior
  'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800&h=600&fit=crop', // Modern villa
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', // Designer living space
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop', // Contemporary apartment
  'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&h=600&fit=crop', // Stylish interior
]

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&h=800&fit=crop',
]

const UNSPLASH_CATEGORIES = ['property', 'home', 'real estate', 'architecture', 'interior'];
const IMAGE_SEEDS = ['seed1', 'seed2', 'seed3', 'seed4', 'seed5'];

/**
 * Generate a random property image URL from curated collection
 * @param width - Image width (unused, images are pre-sized)
 * @param height - Image height (unused, images are pre-sized)
 * @param seed - Optional seed for consistent images (use property ID)
 * @returns High-quality property image URL
 */
export function getRandomPropertyImage(
  width: number = 400,
  height: number = 300,
  seed?: string
): string {
  if (seed) {
    // Use seed for consistent images per property
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return PROPERTY_IMAGES[index % PROPERTY_IMAGES.length]
  }
  
  // Random image every time
  return PROPERTY_IMAGES[Math.floor(Math.random() * PROPERTY_IMAGES.length)]
}

/**
 * Get a consistent image for a property ID
 * @param propertyId - Unique property identifier
 * @param width - Image width (unused)
 * @param height - Image height (unused)
 * @returns Consistent high-quality property image URL
 */
export function getPropertyImage(
  propertyId: string,
  width: number = 400,
  height: number = 300
): string {
  // Use property ID to get consistent image
  const index = parseInt(propertyId.replace(/\D/g, '')) || 0
  return PROPERTY_IMAGES[index % PROPERTY_IMAGES.length]
}

/**
 * Get multiple images for a property gallery
 * @param propertyId - Unique property identifier
 * @param count - Number of images
 * @returns Array of high-quality image URLs
 */
export function getPropertyGallery(propertyId: string, count: number = 5): string[] {
  const images: string[] = []
  const baseIndex = parseInt(propertyId.replace(/\D/g, '')) || 0
  
  for (let i = 0; i < count; i++) {
    const imageIndex = (baseIndex + i) % GALLERY_IMAGES.length
    images.push(GALLERY_IMAGES[imageIndex])
  }
  
  return images
}
