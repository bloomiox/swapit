'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  initialIndex?: number
  itemTitle: string
}

export function ImageGalleryModal({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0, 
  itemTitle 
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images || images.length === 0) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 
            className="text-h5 pr-8"
            style={{ color: 'var(--text-primary)' }}
          >
            {itemTitle}
          </h2>
          <p 
            className="text-body-small mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {currentIndex + 1} of {images.length}
          </p>
        </div>

        {/* Main Image */}
        <div className="relative mb-6">
          <div 
            className="relative w-full h-[500px] rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <Image
              src={images[currentIndex]}
              alt={`${itemTitle} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 justify-center overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index 
                    ? 'border-primary scale-105' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`${itemTitle} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}