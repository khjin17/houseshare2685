// Performance optimization utilities

// Debounce function for search inputs and frequent updates
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Lazy load images
export function lazyLoadImage(imgElement: HTMLImageElement) {
  const src = imgElement.dataset.src
  if (!src) return
  
  const img = new Image()
  img.onload = () => {
    imgElement.src = src
    imgElement.classList.add('loaded')
  }
  img.src = src
}

// Intersection Observer for lazy loading
export function setupIntersectionObserver(
  elements: NodeListOf<Element>,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry)
        observer.unobserve(entry.target)
      }
    })
  }, options)
  
  elements.forEach((element) => observer.observe(element))
  
  return observer
}

// Memoization helper
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Format large numbers compactly
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Pi formatting with proper decimal places based on value
export function formatPiAmount(amount: number): string {
  if (amount >= 1) {
    return `π${amount.toFixed(2)}`
  } else if (amount >= 0.01) {
    return `π${amount.toFixed(4)}`
  } else if (amount >= 0.0001) {
    return `π${amount.toFixed(6)}`
  } else {
    return `π${amount.toFixed(8)}`
  }
}
