'use client'

import React, { useState } from 'react'
import { X, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  otherUser: {
    name: string
    initials: string
  }
  swappedItem: {
    title: string
  }
  onSubmitReview: (review: {
    rating: number
    comment: string
  }) => void
}

export function ReviewModal({ 
  isOpen, 
  onClose, 
  otherUser, 
  swappedItem,
  onSubmitReview 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    
    onSubmitReview({
      rating,
      comment: comment.trim()
    })
    
    // Reset form
    setRating(0)
    setComment('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-[500px] max-h-[95vh] overflow-y-auto rounded-3xl p-6"
        style={{ 
          backgroundColor: 'var(--bg-card)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity z-10"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 
            className="text-h4 font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Rate Your Experience
          </h2>
          <p 
            className="text-body-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            How was your swap with {otherUser.name}?
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-body-medium font-bold"
            style={{ 
              backgroundColor: '#D8F7D7',
              color: '#119C21'
            }}
          >
            {otherUser.initials}
          </div>
          <div>
            <div 
              className="text-body-medium font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {otherUser.name}
            </div>
            <div 
              className="text-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Swapped: {swappedItem.title}
            </div>
          </div>
        </div>

        {/* Rating */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label 
              className="text-body-medium font-semibold block mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Rating *
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label 
              className="text-body-medium font-semibold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Share your experience with this swapper..."
              maxLength={500}
            />
            <div 
              className="text-body-small mt-1 text-right"
              style={{ color: 'var(--text-secondary)' }}
            >
              {comment.length}/500
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outlined" 
              size="large" 
              className="flex-1"
              onClick={onClose}
            >
              Skip
            </Button>
            <Button 
              type="submit"
              variant="primary" 
              size="large" 
              className="flex-1"
              disabled={rating === 0}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}