'use client'

import React, { useState } from 'react'
import { X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: {
    name: string
    email: string
    bio: string
    location: string
  }
  onSave: (userData: {
    name: string
    bio: string
    location: string
  }) => void
}

export function EditProfileModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onSave 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    bio: currentUser.bio,
    location: currentUser.location
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
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
            Edit Profile
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field (Disabled) */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full px-4 py-3 rounded-2xl border text-body-medium cursor-not-allowed"
              style={{ 
                backgroundColor: 'var(--bg-disabled)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Tell others about yourself..."
              maxLength={200}
            />
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <label 
              className="text-body-medium font-semibold block"
              style={{ color: 'var(--text-primary)' }}
            >
              Location
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
                placeholder="Enter your location"
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

          {/* Update Button */}
          <div className="pt-4">
            <Button 
              type="submit"
              variant="primary" 
              size="large" 
              className="w-full"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}