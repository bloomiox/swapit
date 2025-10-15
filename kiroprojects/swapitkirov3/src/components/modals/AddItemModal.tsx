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

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (itemId: string, itemTitle: string) => void
}

interface FormData {
  photos: File[]
  itemType: 'swap' | 'drop'
  title: string
  description: string
  category: string
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor'
  location: string
  swapPreferences: string[]
}

const categories = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Sports & Outdoors',
  'Home & Garden',
  'Toys & Games',
  'Other'
]

const conditions = [
  { id: 'new', label: 'New', emoji: '😊' },
  { id: 'like-new', label: 'Like New', emoji: '🙂' },
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
    category: '',
    condition: 'new',
    location: '',
    swapPreferences: []
  })
  const [addAnother, setAddAnother] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [newPreference, setNewPreference] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<{ id: string; title: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (formData.photos.length + files.length <= 8) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files]
      }))
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (formData.photos.length < 3) {
      alert('Please add at least 3 photos')
      return
    }
    
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description')
      return
    }
    
    if (!formData.category) {
      alert('Please select a category')
      return
    }
    
    if (!formData.location.trim()) {
      alert('Please enter a location')
      return
    }
    
    console.log('Form submitted:', formData)
    
    // Generate a mock item ID (in real app, this would come from the API)
    const itemId = `item_${Date.now()}`
    const itemTitle = formData.title
    
    // Store the added item info
    setLastAddedItem({ id: itemId, title: itemTitle })
    
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
        category: '',
        condition: 'new',
        location: formData.location,
        swapPreferences: formData.swapPreferences
      })
      setShowSuccessModal(true)
    }
    
    onSuccess?.(itemId, itemTitle)
  }

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
                Min 3 & Max 8 photos (each up to 10 MB)
              </p>
            </div>
            
            <div className="flex gap-1 overflow-x-auto">
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-[140px] h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#D8F7D7' }}
                >
                  <Plus 
                    className="w-6 h-6" 
                    style={{ color: '#416B40' }}
                    strokeWidth={1.5}
                  />
                </div>
              </button>

              {/* Photo Previews */}
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative flex-shrink-0 w-[140px] h-[200px] rounded-xl overflow-hidden">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#FDE1E0' }}
                  >
                    <X 
                      className="w-5 h-5" 
                      style={{ color: '#7C0D09' }}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
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
                    Drop It
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
            >
              <span 
                style={{ color: formData.category ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {formData.category || 'Select'}
              </span>
              <ChevronDown 
                className="w-5 h-5" 
                style={{ color: 'var(--text-primary)' }}
                strokeWidth={1.5}
              />
            </button>

            {showCategoryDropdown && (
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
                    key={category}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category }))
                      setShowCategoryDropdown(false)
                    }}
                    className="w-full p-3 text-left hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {category}
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
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
                className="w-full p-3 pr-12 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <MapPin 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: 'var(--text-primary)' }}
                strokeWidth={1.5}
              />
            </div>
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
                formData.photos.length < 3 || 
                !formData.title.trim() || 
                !formData.description.trim() || 
                !formData.category || 
                !formData.location.trim()
              }
            >
              Add Item
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