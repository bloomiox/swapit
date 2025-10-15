'use client'

import React, { useState } from 'react'
import { X, Upload, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  currentItem: {
    id: string
    title: string
    description: string
    condition: string
    category: string
    location: string
    isFree: boolean
    image: string
  }
  onSaveItem: (itemData: {
    title: string
    description: string
    condition: string
    category: string
    location: string
    isFree: boolean
  }) => void
}

const categories = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Sports',
  'Home & Garden',
  'Toys',
  'Other'
]

const conditions = [
  'Like New',
  'Good',
  'Fair',
  'Poor'
]

export function EditItemModal({ 
  isOpen, 
  onClose, 
  currentItem, 
  onSaveItem 
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    title: currentItem.title,
    description: currentItem.description,
    condition: currentItem.condition,
    category: currentItem.category,
    location: currentItem.location,
    isFree: currentItem.isFree
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveItem(formData)
    onClose()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
        className="relative w-full max-w-[600px] max-h-[95vh] overflow-y-auto rounded-3xl p-6"
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
        <div className="mb-6">
          <h2 
            className="text-h4 font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Edit Item
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Image Preview */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Current Photo
            </label>
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
              <img 
                src={currentItem.image} 
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="What are you swapping?"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Describe your item..."
              required
            />
          </div>

          {/* Category and Condition Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label 
                className="text-body-medium font-semibold block"
                style={{ color: 'var(--text-primary)' }}
              >
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                style={{ 
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label 
                className="text-body-medium font-semibold block"
                style={{ color: 'var(--text-primary)' }}
              >
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                style={{ 
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Location *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                style={{ 
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Where is this item located?"
                required
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <MapPin 
                  className="w-5 h-5" 
                  style={{ color: 'var(--text-primary)' }}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Free Item Toggle */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFree}
                onChange={(e) => handleInputChange('isFree', e.target.checked)}
                className="w-4 h-4 text-primary"
              />
              <div>
                <div 
                  className="text-body-medium font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  This is a free item
                </div>
                <div 
                  className="text-body-small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  I'm giving this away for free
                </div>
              </div>
            </label>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button 
              type="submit"
              variant="primary" 
              size="large" 
              className="w-full"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}