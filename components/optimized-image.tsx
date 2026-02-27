"use client"

import React, { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallbackSrc?: string
}

export function OptimizedImage({ 
  src, 
  alt, 
  className,
  fallbackSrc = "/placeholder.svg",
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/10 to-secondary/10" />
      )}
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        {...props}
      />
    </div>
  )
}
