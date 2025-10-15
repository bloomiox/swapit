'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { MapPin, User, Heart, ArrowRight, ArrowLeft, Locate } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface ProfileData {
  firstName: string
  lastName: string
  bio: string
  location: string
  interests: string[]
}

const categories = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Sports & Outdoors',
  'Home & Garden',
  'Toys & Games',
  'Art & Crafts',
  'Music & Instruments',
  'Kitchen & Dining',
  'Beauty & Health',
  'Automotive'
]

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    interests: []
  })
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
    onClose()
  }

  const handleComplete = () => {
    // Handle profile completion logic here
    console.log('Profile completed:', profileData)
    onComplete()
    onClose()
  }

  // Auto-detect location when modal opens
  useEffect(() => {
    if (isOpen && currentStep === 1 && !profileData.location) {
      detectLocation()
    }
  }, [isOpen, currentStep])

  const detectLocation = async () => {
    setIsDetectingLocation(true)
    
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.')
      setIsDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // For demo purposes, we'll use a simple city mapping based on coordinates
          // In a real app, you'd use a reverse geocoding service
          let detectedCity = 'Current Location'
          
          // Simple coordinate-based city detection for Switzerland
          if (latitude >= 47.0 && latitude <= 47.8 && longitude >= 6.0 && longitude <= 10.5) {
            if (latitude >= 47.3 && latitude <= 47.4 && longitude >= 8.4 && longitude <= 8.6) {
              detectedCity = 'Zurich, Switzerland'
            } else if (latitude >= 46.1 && latitude <= 46.3 && longitude >= 6.0 && longitude <= 6.3) {
              detectedCity = 'Geneva, Switzerland'
            } else if (latitude >= 47.5 && latitude <= 47.6 && longitude >= 7.5 && longitude <= 7.6) {
              detectedCity = 'Basel, Switzerland'
            } else if (latitude >= 47.4 && latitude <= 47.5 && longitude >= 9.3 && longitude <= 9.4) {
              detectedCity = 'St. Gallen, Switzerland'
            } else {
              detectedCity = 'Switzerland'
            }
          }
          
          handleInputChange('location', detectedCity)
        } catch (error) {
          console.error('Error getting location name:', error)
          handleInputChange('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        }
        
        setIsDetectingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const isStep1Valid = profileData.firstName.trim() && profileData.lastName.trim()
  const isStep2Valid = profileData.interests.length > 0

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div 
                    className={`w-16 h-1 mx-2 transition-colors ${
                      step < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p 
              className="text-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Step {currentStep} of 3
            </p>
          </div>
        </div>

        {/* Step 1: Profile Information */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 
                className="text-h4 mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Tell us about yourself
              </h2>
              <p 
                className="text-body-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Help others get to know you better
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label 
                    className="block text-body-small-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label 
                    className="block text-body-small-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label 
                  className="block text-body-small-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Bio (Optional)
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell others about yourself, your interests, or what you're looking to swap..."
                  rows={3}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    className="block text-body-small-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Location (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="flex items-center gap-1 text-body-small text-primary hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    <Locate className="w-4 h-4" />
                    {isDetectingLocation ? 'Detecting...' : 'Detect'}
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={isDetectingLocation ? "Detecting your location..." : "City, State"}
                    className="w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    disabled={isDetectingLocation}
                  />
                </div>
                {isDetectingLocation && (
                  <p className="text-body-small" style={{ color: 'var(--text-secondary)' }}>
                    We're automatically detecting your location to help you find nearby items...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Interests */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 
                className="text-h4 mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                What interests you?
              </h2>
              <p 
                className="text-body-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Select categories you're interested in swapping
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleInterestToggle(category)}
                  className={`p-4 border rounded-2xl text-left transition-all hover:shadow-sm ${
                    profileData.interests.includes(category)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  style={{ 
                    borderColor: profileData.interests.includes(category) 
                      ? 'var(--primary)' 
                      : 'var(--border-color)',
                    backgroundColor: profileData.interests.includes(category)
                      ? 'var(--primary-light, rgba(17, 156, 33, 0.05))'
                      : 'var(--bg-card)'
                  }}
                >
                  <span 
                    className={`text-body-small-bold ${
                      profileData.interests.includes(category) ? 'text-primary' : ''
                    }`}
                    style={{ 
                      color: profileData.interests.includes(category) 
                        ? 'var(--primary)' 
                        : 'var(--text-primary)' 
                    }}
                  >
                    {category}
                  </span>
                </button>
              ))}
            </div>

            {profileData.interests.length > 0 && (
              <div className="mt-4 text-center">
                <p 
                  className="text-body-small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {profileData.interests.length} categories selected
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Overview */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 
                className="text-h4 mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                You're all set!
              </h2>
              <p 
                className="text-body-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Here's your profile overview
              </p>
            </div>

            <div 
              className="p-6 border rounded-2xl mb-6"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="space-y-4">
                <div>
                  <h3 
                    className="text-h4 mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  {profileData.location && (
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <span 
                        className="text-body-small"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {profileData.location}
                      </span>
                    </div>
                  )}
                  {profileData.bio && (
                    <p 
                      className="text-body-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {profileData.bio}
                    </p>
                  )}
                </div>

                {profileData.interests.length > 0 && (
                  <div>
                    <h4 
                      className="text-body-small-bold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-body-small"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6">
          <div>
            {currentStep > 1 && (
              <Button 
                variant="outlined" 
                size="default" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="default" 
              onClick={handleSkip}
            >
              Skip
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                variant="primary" 
                size="default" 
                onClick={handleNext}
                disabled={currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="default" 
                onClick={handleComplete}
                className="flex items-center gap-2"
              >
                Start Swapping
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}