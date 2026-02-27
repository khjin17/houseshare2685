"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  fallback?: ReactNode
}

export function LazyLoad({ 
  children, 
  threshold = 0.1, 
  rootMargin = "50px",
  fallback = null
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}
