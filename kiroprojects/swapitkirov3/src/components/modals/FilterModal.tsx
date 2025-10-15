'use client'

import React, { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'condition' | 'distance' | 'sorting' | 'type' | 'category'
  currentValue: any
  onApply: (value: any) => void
}

const conditionOptions = [
  { id: 'all', label: 'All Conditions' },
  { id: 'new', label: 'Like New' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
  { id: 'poor', label: 'Poor' }
]

const sortingOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'distance', label: 'Distance (Nearest)' },
  { id: 'alphabetical', label: 'Alphabetical' }
]

const typeOptions = [
  { id: 'all', label: 'All Items' },
  { id: 'free', label: 'Free Items Only' },
  { id: 'swap', label: 'Swap Items Only' }
]

const categoryOptions = [
  { id: 'all', name: 'All Categories', icon: '📦' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'clothing-fashion', name: 'Clothing & Fashion', icon: '👕' },
  { id: 'books-media', name: 'Books & Media', icon: '📚' },
  { id: 'home-furniture', name: 'Home & Furniture', icon: '🏠' },
  { id: 'sports-fitness', name: 'Sports & Fitness', icon: '⚽' },
  { id: 'toys-games', name: 'Toys & Games', icon: '🎮' },
  { id: 'music-instruments', name: 'Music & Instruments', icon: '🎵' },
  { id: 'art-crafts', name: 'Art & Crafts', icon: '🎨' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'health-beauty', name: 'Health & Beauty', icon: '💄' },
  { id: 'baby-kids', name: 'Baby & Kids', icon: '👶' },
  { id: 'pet-supplies', name: 'Pet Supplies', icon: '🐕' },
  { id: 'tools-hardware', name: 'Tools & Hardware', icon: '🔧' },
  { id: 'kitchen-dining', name: 'Kitchen & Dining', icon: '🍽️' },
  { id: 'office-business', name: 'Office & Business', icon: '💼' },
  { id: 'garden-outdoor', name: 'Garden & Outdoor', icon: '🌱' },
  { id: 'jewelry-watches', name: 'Jewelry & Watches', icon: '💎' },
  { id: 'collectibles-antiques', name: 'Collectibles & Antiques', icon: '👑' },
  { id: 'travel-luggage', name: 'Travel & Luggage', icon: '✈️' },
  { id: 'photography', name: 'Photography', icon: '📷' },
  { id: 'computer-gaming', name: 'Computer & Gaming', icon: '💻' },
  { id: 'mobile-tablets', name: 'Mobile & Tablets', icon: '📱' },
  { id: 'audio-headphones', name: 'Audio & Headphones', icon: '🎧' },
  { id: 'bicycles-scooters', name: 'Bicycles & Scooters', icon: '🚲' },
  { id: 'food-beverages', name: 'Food & Beverages', icon: '☕' }
]

export function FilterModal({ 
  isOpen, 
  onClose, 
  type, 
  currentValue, 
  onApply 
}: FilterModalProps) {
  const [selectedValue, setSelectedValue] = useState(currentValue)

  const handleApply = () => {
    onApply(selectedValue)
    onClose()
  }

  const handleReset = () => {
    const defaultValue = type === 'distance' ? 50 : 
                        type === 'condition' ? 'all' :
                        type === 'sorting' ? 'newest' :
                        type === 'category' ? [] :
                        'all'
    setSelectedValue(defaultValue)
  }

  if (!isOpen) return null

  const getTitle = () => {
    switch (type) {
      case 'condition': return 'Condition'
      case 'distance': return 'Distance'
      case 'sorting': return 'Sort By'
      case 'type': return 'Item Type'
      case 'category': return 'Category'
      default: return 'Filter'
    }
  }

  const renderContent = () => {
    switch (type) {
      case 'condition':
        return (
          <div className="space-y-2">
            {conditionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedValue(option.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded-xl"
              >
                <span 
                  className="text-body-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {option.label}
                </span>
                <div 
                  className="w-5 h-5 border-2 rounded-full flex items-center justify-center"
                  style={{ 
                    borderColor: selectedValue === option.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                    backgroundColor: selectedValue === option.id ? 'var(--primary-color)' : 'transparent'
                  }}
                >
                  {selectedValue === option.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      case 'distance':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-body-medium font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Maximum Distance
                </span>
                <span 
                  className="text-body-medium font-bold"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {selectedValue} km
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={selectedValue}
                onChange={(e) => setSelectedValue(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${selectedValue}%, #e5e7eb ${selectedValue}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-body-small mt-2" style={{ color: 'var(--text-secondary)' }}>
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 25, 50].map((distance) => (
                <button
                  key={distance}
                  onClick={() => setSelectedValue(distance)}
                  className={`px-3 py-2 rounded-xl text-body-small transition-colors ${
                    selectedValue === distance
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedValue === distance ? 'var(--primary-color)' : '#f3f4f6',
                    color: selectedValue === distance ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {distance} km
                </button>
              ))}
            </div>
          </div>
        )

      case 'sorting':
        return (
          <div className="space-y-2">
            {sortingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedValue(option.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded-xl"
              >
                <span 
                  className="text-body-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {option.label}
                </span>
                <div 
                  className="w-5 h-5 border-2 rounded-full flex items-center justify-center"
                  style={{ 
                    borderColor: selectedValue === option.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                    backgroundColor: selectedValue === option.id ? 'var(--primary-color)' : 'transparent'
                  }}
                >
                  {selectedValue === option.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      case 'type':
        return (
          <div className="space-y-2">
            {typeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedValue(option.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded-xl"
              >
                <span 
                  className="text-body-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {option.label}
                </span>
                <div 
                  className="w-5 h-5 border-2 rounded-full flex items-center justify-center"
                  style={{ 
                    borderColor: selectedValue === option.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                    backgroundColor: selectedValue === option.id ? 'var(--primary-color)' : 'transparent'
                  }}
                >
                  {selectedValue === option.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      case 'category':
        const handleCategoryToggle = (categoryId: string) => {
          if (categoryId === 'all') {
            const allCategories = categoryOptions.slice(1).map(c => c.id)
            setSelectedValue(
              selectedValue.length === allCategories.length ? [] : allCategories
            )
          } else {
            setSelectedValue((prev: string[]) => 
              prev.includes(categoryId) 
                ? prev.filter((id: string) => id !== categoryId)
                : [...prev, categoryId]
            )
          }
        }

        const isAllSelected = selectedValue.length === categoryOptions.length - 1
        const isIndeterminate = selectedValue.length > 0 && selectedValue.length < categoryOptions.length - 1

        return (
          <div className="space-y-2">
            {categoryOptions.map((category, index) => (
              <div key={category.id}>
                <button
                  onClick={() => handleCategoryToggle(category.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors rounded-xl"
                >
                  {/* Icon */}
                  {category.id !== 'all' && (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      {category.icon}
                    </div>
                  )}
                  
                  {/* Text */}
                  <div className="flex-1 text-left">
                    <span 
                      className="text-body-medium" 
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {category.name}
                    </span>
                  </div>

                  {/* Checkbox */}
                  <div 
                    className="w-5 h-5 border-2 rounded flex items-center justify-center"
                    style={{ 
                      borderColor: category.id === 'all' 
                        ? (isAllSelected || isIndeterminate ? 'var(--primary-color)' : 'var(--text-secondary)')
                        : (selectedValue.includes(category.id) ? 'var(--primary-color)' : 'var(--text-secondary)'),
                      backgroundColor: category.id === 'all'
                        ? (isAllSelected || isIndeterminate ? 'var(--primary-color)' : 'transparent')
                        : (selectedValue.includes(category.id) ? 'var(--primary-color)' : 'transparent')
                    }}
                  >
                    {category.id === 'all' ? (
                      isIndeterminate ? (
                        <div className="w-2 h-0.5 bg-white" />
                      ) : isAllSelected ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : null
                    ) : selectedValue.includes(category.id) ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : null}
                  </div>
                </button>
                
                {/* Divider after "All Categories" */}
                {index === 0 && (
                  <div className="mx-4 h-px my-2" style={{ backgroundColor: 'var(--border-color)' }} />
                )}
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-[400px] max-h-[95vh] overflow-y-auto rounded-3xl"
        style={{ 
          backgroundColor: 'var(--bg-card)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
          </button>
          <h3 
            className="text-h6 font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {getTitle()}
          </h3>
          <button
            onClick={handleReset}
            className="text-body-small font-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--primary-color)' }}
          >
            Reset
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <Button 
            variant="primary" 
            size="large" 
            className="w-full"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}