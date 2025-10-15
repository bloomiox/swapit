'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: React.ReactNode
  fill?: boolean
  sizes?: string
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallback,
  fill = false,
  sizes
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height 
        }}
      >
        {fallback || <User className="w-8 h-8 text-gray-400" />}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse"
          style={{ 
            width: fill ? '100%' : width, 
            height: fill ? '100%' : height 
          }}
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        className={className}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
        onLoad={() => setImageLoading(false)}
      />
    </div>
  )
}