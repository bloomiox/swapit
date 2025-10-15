'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { AvatarUpload } from '@/components/ui/AvatarUpload'
import { MapPin, User, Heart, ArrowRight, ArrowLeft, Locate, Camera } from 'lucide-react'
import { useProfileActions } from '@/hooks/useUserProfile'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

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
  avatarUrl: string | null
}

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    interests: [],
    avatarUrl: null
  })
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const { uploadAvatar } = useProfileActions()
  const { user } = useAuth()

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

  const handleSkipStep = () => {
    // Skip current step and move to next
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // If on last step, complete onboarding
      handleComplete()
    }
  }

  const handleSkipAll = async () => {
    try {
      // Mark onboarding as completed when skipping all
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
      
      if (error) {
        console.error('Error marking onboarding as skipped:', error)
        console.error('Skip error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
      }
    } catch (error) {
      console.error('Error in handleSkipAll:', error)
    }
    
    onComplete()
    
    // Redirect to browse page after skipping onboarding
    router.push('/browse')
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true)
      const avatarUrl = await uploadAvatar(file)
      setProfileData(prev => ({ ...prev, avatarUrl }))
      setShowAvatarUpload(false)
    } catch (error) {
      console.error('Avatar upload failed:', error)
      // Could show an error toast here
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleComplete = async () => {
    try {
      // Handle profile completion logic here
      console.log('Profile completed:', profileData)
      
      // Save profile data to users table
      const profileUpdateData = {
        full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        bio: profileData.bio || null,
        location_name: profileData.location || null,
        avatar_url: profileData.avatarUrl
      }
      
      console.log('Saving profile data:', profileUpdateData)
      
      const { data: profileResult, error: profileError } = await supabase
        .from('users')
        .update(profileUpdateData)
        .eq('id', user?.id)
        .select()
      
      if (profileError) {
        console.error('Error saving profile:', profileError)
      } else {
        console.log('Profile saved successfully:', profileResult)
      }
      
      // Get category IDs for selected interests
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        
      const matchingCategories = categories?.filter(cat => 
        profileData.interests.includes(cat.name)
      ) || []
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
      }
      
      const categoryIds = matchingCategories.map(cat => cat.id)
      
      // Save preferences and mark onboarding as completed
      const preferencesData = {
        user_id: user?.id,
        categories_of_interest: categoryIds,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      }
      
      console.log('Saving preferences data:', preferencesData)
      
      const { data: preferencesResult, error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert(preferencesData, {
          onConflict: 'user_id'
        })
        .select()
      
      if (preferencesError) {
        console.error('Error saving preferences:', preferencesError)
        console.error('Preferences error details:', {
          code: preferencesError.code,
          message: preferencesError.message,
          details: preferencesError.details,
          hint: preferencesError.hint
        })
      } else {
        console.log('Preferences saved successfully:', preferencesResult)
      }
      
      // Small delay to ensure database operations complete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Dispatch profile update event to trigger refresh in profile components
      const { dispatchProfileUpdate } = await import('@/lib/events')
      dispatchProfileUpdate()
      
      onComplete()
      
      // Redirect to browse page after onboarding completion
      router.push('/browse')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // Still complete onboarding even if there's an error
      onComplete()
      
      // Redirect to browse page even if there's an error
      router.push('/browse')
    }
  }

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  // Auto-detect location when modal opens
  useEffect(() => {
    if (isOpen && currentStep === 1 && !profileData.location) {
      detectLocation()
    }
  }, [isOpen, currentStep])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      console.log('Loading categories...')
      
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Supabase error loading categories:', error)
        throw error
      }

      console.log('Categories data from database:', data)
      const categoryNames = data.map(cat => cat.name).filter(Boolean)
      console.log('Processed category names:', categoryNames)
      setCategories(categoryNames)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to default categories
      const fallbackCategories = [
        'Electronics',
        'Clothing & Fashion', 
        'Books & Media',
        'Home & Furniture',
        'Sports & Fitness',
        'Toys & Games',
        'Automotive',
        'Health & Beauty',
        'Art & Crafts',
        'Computer & Gaming'
      ]
      console.log('Using fallback categories:', fallbackCategories)
      setCategories(fallbackCategories)
    } finally {
      setLoadingCategories(false)
    }
  }

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
  const isStep2Valid = true // Step 2 is always valid, interests are optional

  return (
    <Modal isOpen={isOpen} onClose={() => {}} disableClose={true}>
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
              {/* Profile Photo */}
              <div className="space-y-2">
                <label 
                  className="block text-body-small-bold text-center"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Profile Photo (Optional)
                </label>
                <div className="flex justify-center">
                  <div className="relative">
                    <div 
                      className="w-24 h-24 rounded-full overflow-hidden border-4 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ borderColor: 'var(--border-color)' }}
                      onClick={() => setShowAvatarUpload(true)}
                    >
                      {profileData.avatarUrl ? (
                        <img
                          src={profileData.avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: '#D8F7D7',
                            color: '#119C21'
                          }}
                        >
                          <Camera className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAvatarUpload(true)}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p 
                  className="text-caption text-center"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Click to add a profile photo
                </p>
              </div>

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

            {loadingCategories ? (
              <div className="grid grid-cols-2 gap-3">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="p-4 border rounded-2xl animate-pulse">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-body-medium" style={{ color: 'var(--text-secondary)' }}>
                  No categories available. Please try again later.
                </p>
              </div>
            ) : (
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
            )}

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
            {currentStep < 3 ? (
              <>
                <Button 
                  variant="secondary" 
                  size="default" 
                  onClick={handleSkipStep}
                >
                  Skip Step
                </Button>
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
              </>
            ) : (
              <>
                <Button 
                  variant="secondary" 
                  size="default" 
                  onClick={handleSkipAll}
                >
                  Skip All
                </Button>
                <Button 
                  variant="primary" 
                  size="default" 
                  onClick={handleComplete}
                  className="flex items-center gap-2"
                >
                  Start Swapping
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAvatarUpload(false)}
          />
          <div 
            className="relative w-full max-w-md rounded-3xl p-6"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <AvatarUpload
              currentImageUrl={profileData.avatarUrl}
              onUpload={handleAvatarUpload}
              onCancel={() => setShowAvatarUpload(false)}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}