'use client'

import React, { useState, useRef } from 'react'
import { 
  X, 
  Plus, 
  RotateCcw, 
  ArrowDown, 
  MapPin,
  ChevronDown
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ItemAddedSuccessModal } from './ItemAddedSuccessModal'
import { BoostItemModal } from './BoostItemModal'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { LocationPicker } from '@/components/ui/LocationPicker'
import { useAuth } from '@/contexts/AuthContext'
import { useCategories, useCreateItem } from '@/hooks/useCategories'

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (itemId: string, itemTitle: string) => void
}

interface Location {
  name: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface FormData {
  photos: string[] // Changed to store URLs instead of File objects
  itemType: 'swap' | 'drop'
  title: string
  description: string
  categoryId: string
  condition: 'like_new' | 'good' | 'fair' | 'poor'
  location: Location | null
  swapPreferences: string[]
}

const conditions = [
  { id: 'like_new', label: 'Like New', emoji: '🙂' },
  { id: 'good', label: 'Good', emoji: '😐' },
  { id: 'fair', label: 'Fair', emoji: '🙁' },
  { id: 'poor', label: 'Poor', emoji: '😞' }
] as const

export function AddItemModal({ isOpen, onClose, onSuccess }: AddItemModalProps) {
  const [formData, setFormData] = useState<FormData>({
    photos: [],
    itemType: 'swap',
    title: '',
    description: '',
    categoryId: '',
    condition: 'like_new',
    location: null,
    swapPreferences: []
  })
  const [addAnother, setAddAnother] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [newPreference, setNewPreference] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<{ id: string; title: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasPromptedLocation, setHasPromptedLocation] = useState(false)
  
  const { user } = useAuth()
  const { categories, loading: categoriesLoading } = useCategories()
  const { createItem, loading: createLoading, error: createError } = useCreateItem()

  // Auto-prompt for location when modal opens
  React.useEffect(() => {
    if (isOpen && !hasPromptedLocation && !formData.location) {
      // Small delay to let the modal animation complete
      const timer = setTimeout(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              const detectedLocation: Location = {
                name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                coordinates: { lat: latitude, lng: longitude }
              }
              setFormData(prev => ({ ...prev, location: detectedLocation }))
              setHasPromptedLocation(true)
            },
            (error) => {
              console.log('Location detection declined or failed:', error)
              setHasPromptedLocation(true)
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          )
        } else {
          setHasPromptedLocation(true)
        }
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, hasPromptedLocation, formData.location])

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...urls].slice(0, 8) // Limit to 8 photos
    }))
    setError(null)
  }

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const removePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      swapPreferences: prev.swapPreferences.filter(p => p !== preference)
    }))
  }

  const addPreference = () => {
    if (newPreference.trim() && !formData.swapPreferences.includes(newPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        swapPreferences: [...prev.swapPreferences, newPreference.trim()]
      }))
      setNewPreference('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to add an item')
      return
    }
    
    // Basic validation
    if (formData.photos.length < 1) {
      setError('Please add at least 1 photo')
      return
    }
    
    if (!formData.title.trim()) {
      setError('Please enter a title')
      return
    }
    
    if (!formData.description.trim()) {
      setError('Please enter a description')
      return
    }
    
    if (!formData.categoryId) {
      setError('Please select a category')
      return
    }
    
    if (!formData.location) {
      setError('Please select a location')
      return
    }

    setError(null)

    try {
      // Create item using the hook
      const itemData = await createItem({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: formData.categoryId,
        condition: formData.condition,
        is_free: formData.itemType === 'drop',
        images: formData.photos,
        location_name: formData.location.name,
        location_coordinates: formData.location.coordinates,
        looking_for: formData.swapPreferences.length > 0 ? formData.swapPreferences.join(', ') : null
      })

      console.log('Item created successfully:', itemData)
      
      // Store the added item info
      setLastAddedItem({ id: itemData.id, title: itemData.title })
      
      if (!addAnother) {
        // Close the add item modal and show success modal
        onClose()
        setShowSuccessModal(true)
      } else {
        // Reset form but keep some preferences and show success modal
        setFormData({
          photos: [],
          itemType: formData.itemType,
          title: '',
          description: '',
          categoryId: '',
          condition: 'like_new',
          location: formData.location,
          swapPreferences: formData.swapPreferences
        })
        setShowSuccessModal(true)
      }
      
      onSuccess?.(itemData.id, itemData.title)
    } catch (error) {
      console.error('Error creating item:', error)
      setError(error instanceof Error ? error.message : 'Failed to create item')
    }
  }

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        photos: [],
        itemType: 'swap',
        title: '',
        description: '',
        categoryId: '',
        condition: 'like_new',
        location: null,
        swapPreferences: []
      })
      setHasPromptedLocation(false)
      setError(null)
      setNewPreference('')
      setShowCategoryDropdown(false)
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[600px] mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 
            className="text-h4 font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Add Item
          </h2>
        </div>

        {/* Error Message */}
        {(error || createError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error || createError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photos Section */}
          <div>
            <div className="mb-2">
              <label 
                className="text-body-normal font-bold block"
                style={{ color: 'var(--text-primary)' }}
              >
                Photos
              </label>
              <p 
                className="text-caption"
                style={{ color: 'var(--text-secondary)' }}
              >
                Min 1 & Max 8 photos (each up to 10 MB)
              </p>
            </div>
            
            <ImageUpload
              bucket="item-images"
              onUpload={handleImageUpload}
              onError={handleImageError}
              multiple={true}
              maxFiles={8}
              compress={true}
            />

            {/* Current Photos Display */}
            {formData.photos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.photos.length} photo{formData.photos.length !== 1 ? 's' : ''} uploaded
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {formData.photos.map((photoUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={photoUrl}
                          alt={`Item photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Item Type Selection */}
          <div>
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Item Type
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, itemType: 'swap' }))}
                className={`flex-1 flex items-center gap-4 p-3 rounded-2xl border transition-colors ${
                  formData.itemType === 'swap' 
                    ? 'border-primary-dark' 
                    : 'border-general-stroke'
                }`}
                style={{
                  backgroundColor: formData.itemType === 'swap' ? '#D8F7D7' : 'var(--bg-primary)',
                  borderColor: formData.itemType === 'swap' ? '#416B40' : 'var(--border-color)'
                }}
              >
                <RotateCcw 
                  className="w-6 h-6" 
                  style={{ color: formData.itemType === 'swap' ? '#416B40' : 'var(--text-primary)' }}
                  strokeWidth={1.5}
                />
                <div className="text-left">
                  <div 
                    className="text-body-normal font-medium"
                    style={{ color: formData.itemType === 'swap' ? '#416B40' : 'var(--text-primary)' }}
                  >
                    Swap It
                  </div>
                  <div 
                    className="text-body-small"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Exchange for other items
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, itemType: 'drop' }))}
                className={`flex-1 flex items-center gap-4 p-3 rounded-2xl border transition-colors ${
                  formData.itemType === 'drop' 
                    ? 'border-primary-dark' 
                    : 'border-general-stroke'
                }`}
                style={{
                  backgroundColor: formData.itemType === 'drop' ? '#D8F7D7' : 'var(--bg-primary)',
                  borderColor: formData.itemType === 'drop' ? '#416B40' : 'var(--border-color)'
                }}
              >
                <ArrowDown 
                  className="w-6 h-6" 
                  style={{ color: formData.itemType === 'drop' ? '#416B40' : 'var(--text-primary)' }}
                  strokeWidth={1.5}
                />
                <div className="text-left">
                  <div 
                    className="text-body-normal font-medium"
                    style={{ color: formData.itemType === 'drop' ? '#416B40' : 'var(--text-primary)' }}
                  >
                    Free
                  </div>
                  <div 
                    className="text-body-small"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Give away for free
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="ex: iPhone"
              className="w-full p-3 rounded-2xl border"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell others about this item..."
              rows={4}
              className="w-full p-3 rounded-2xl border resize-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              required
            />
          </div>

          {/* Category Field */}
          <div className="relative">
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full p-3 rounded-2xl border flex items-center justify-between"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)'
              }}
              disabled={categoriesLoading}
            >
              <span 
                style={{ color: formData.categoryId ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {formData.categoryId 
                  ? categories.find(c => c.id === formData.categoryId)?.name || 'Select'
                  : categoriesLoading ? 'Loading...' : 'Select'
                }
              </span>
              <ChevronDown 
                className="w-5 h-5" 
                style={{ color: 'var(--text-primary)' }}
                strokeWidth={1.5}
              />
            </button>

            {showCategoryDropdown && !categoriesLoading && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 border rounded-2xl max-h-48 overflow-y-auto"
                style={{
                  zIndex: 10000,
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, categoryId: category.id }))
                      setShowCategoryDropdown(false)
                    }}
                    className="w-full p-3 text-left hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Condition Selection */}
          <div>
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Condition
            </label>
            <div className="flex flex-wrap gap-1">
              {conditions.map((condition) => (
                <button
                  key={condition.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, condition: condition.id }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    formData.condition === condition.id 
                      ? 'border-primary-dark' 
                      : 'border-general-stroke'
                  }`}
                  style={{
                    backgroundColor: formData.condition === condition.id ? '#D8F7D7' : 'var(--bg-primary)',
                    borderColor: formData.condition === condition.id ? '#416B40' : 'var(--border-color)'
                  }}
                >
                  <span className="text-base">{condition.emoji}</span>
                  <span 
                    className="text-caption-medium"
                    style={{ 
                      color: formData.condition === condition.id ? '#416B40' : 'var(--text-primary)' 
                    }}
                  >
                    {condition.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Location
            </label>
            <LocationPicker
              onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
              className="w-full"
              initialLocation={formData.location}
            />
          </div>

          {/* Swap Preferences (only for swap items) */}
          {formData.itemType === 'swap' && (
            <div>
              <label 
                className="text-body-normal font-bold block mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Swap Preferences (Optional)
              </label>
              
              {/* Tags */}
              {formData.swapPreferences.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.swapPreferences.map((preference) => (
                    <div
                      key={preference}
                      className="flex items-center gap-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: '#119C21' }}
                    >
                      <span className="text-caption-medium text-white">
                        {preference}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePreference(preference)}
                        className="w-3 h-3 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new preference */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  placeholder="Add preference..."
                  className="flex-1 p-3 rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
                />
                <Button
                  type="button"
                  variant="outlined"
                  size="default"
                  onClick={addPreference}
                  disabled={!newPreference.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addAnother}
                onChange={(e) => setAddAnother(e.target.checked)}
                className="w-5 h-5 rounded border"
                style={{ borderColor: 'var(--border-color)' }}
              />
              <span 
                className="text-body-normal"
                style={{ color: 'var(--text-primary)' }}
              >
                Add Another
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={
                createLoading ||
                categoriesLoading ||
                formData.photos.length < 1 || 
                !formData.title.trim() || 
                !formData.description.trim() || 
                !formData.categoryId || 
                !formData.location
              }
            >
              {createLoading ? 'Adding Item...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <ItemAddedSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onViewItem={() => {
          if (lastAddedItem) {
            window.location.href = `/item/${lastAddedItem.id}`
          }
          setShowSuccessModal(false)
        }}
        onBoostItem={() => {
          setShowSuccessModal(false)
          setShowBoostModal(true)
        }}
        itemTitle={lastAddedItem?.title}
      />

      {/* Boost Modal */}
      <BoostItemModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        onSuccess={() => {
          console.log('Item boosted successfully')
        }}
        itemTitle={lastAddedItem?.title}
      />
    </Modal>
  )
}