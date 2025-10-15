'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { 
  Camera, 
  Calendar, 
  MapPin, 
  Star, 
  Edit,
  Upload
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ItemCard } from '@/components/ui/ItemCard'
import { EditProfileModal } from '@/components/modals/EditProfileModal'
import { AddItemModal } from '@/components/modals/AddItemModal'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { EmailConfirmationGuard } from '@/components/auth/EmailConfirmationGuard'
import { useCurrentUserProfile, useUserStats, useProfileActions } from '@/hooks/useUserProfile'
import { useUserItems, useSavedItems } from '@/hooks/useItems'
import { useAuth } from '@/contexts/AuthContext'
import { useAddItemModal } from '@/hooks/useAddItemModal'
import { AvatarUpload } from '@/components/ui/AvatarUpload'



export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'my-items' | 'saved-items'>('my-items')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)

  // Add Item Modal
  const { isAddItemOpen, openAddItem, closeAddItem } = useAddItemModal()

  // Data hooks
  const { user: currentUser } = useAuth()
  const { profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useCurrentUserProfile()
  const { stats, loading: statsLoading } = useUserStats()
  const { items: userItems, loading: itemsLoading, refetch: refetchUserItems } = useUserItems()
  const { items: savedItems, loading: savedLoading } = useSavedItems()
  const { updateProfile, uploadAvatar } = useProfileActions()

  const currentItems = activeTab === 'my-items' ? userItems : savedItems
  const currentLoading = activeTab === 'my-items' ? itemsLoading : savedLoading

  const handleSaveProfile = async (updatedData: {
    name: string
    bio: string
    location: string
  }) => {
    try {
      await updateProfile({
        full_name: updatedData.name,
        bio: updatedData.bio,
        location_name: updatedData.location
      })
      refetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatar(file)
      refetchProfile()
      setShowAvatarUpload(false)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  // Debug logging
  console.log('Profile page debug:', {
    profileLoading,
    profile,
    currentUser,
    profileError: profile === null && !profileLoading ? 'Profile is null' : null
  })

  // Loading state
  if (profileLoading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen px-2.5">
          <Navbar />
          <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-6 lg:px-[165px] py-6">
              <div className="w-full lg:w-[354px] p-4 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}>
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </ProtectedRoute>
    )
  }

  // Profile not found or email not confirmed
  if (!profile) {
    const isEmailProvider = currentUser?.app_metadata?.providers?.includes('email')
    const isEmailConfirmed = currentUser?.email_confirmed_at !== null
    const isEmailConfirmationIssue = isEmailProvider && !isEmailConfirmed

    return (
      <ProtectedRoute>
        <main className="min-h-screen px-2.5">
          <Navbar />
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="text-center max-w-md">
              {isEmailConfirmationIssue ? (
                <>
                  <h1 className="text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>Email Confirmation Required</h1>
                  <p className="text-body-large mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Please check your email and click the confirmation link to complete your account setup.
                  </p>
                  <div className="text-left bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm">📧 Confirmation email sent to:</p>
                    <p className="text-sm font-semibold">{currentUser?.email}</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.reload()}
                    className="mb-2"
                  >
                    I've Confirmed My Email
                  </Button>
                </>
              ) : (
                <>
                  <h1 className="text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>Profile Not Found</h1>
                  <p className="text-body-large mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Unable to load your profile. This might be because your profile is still being created.
                  </p>
                  {profileError && (
                    <div className="text-left bg-red-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-red-700">Error: {profileError}</p>
                    </div>
                  )}
                  <div className="text-left bg-gray-100 p-4 rounded-lg mb-4">
                    <p className="text-sm font-mono">Debug Info:</p>
                    <p className="text-sm font-mono">User ID: {currentUser?.id || 'Not logged in'}</p>
                    <p className="text-sm font-mono">Email: {currentUser?.email || 'No email'}</p>
                    <p className="text-sm font-mono">Email Confirmed: {isEmailConfirmed ? 'Yes' : 'No'}</p>
                    <p className="text-sm font-mono">Provider: {currentUser?.app_metadata?.providers?.join(', ') || 'Unknown'}</p>
                    <p className="text-sm font-mono">Loading: {profileLoading ? 'Yes' : 'No'}</p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.reload()}
                    className="mb-2"
                  >
                    Refresh Page
                  </Button>
                  <br />
                  <Button 
                    variant="secondary" 
                    onClick={() => refetchProfile()}
                  >
                    Retry Loading Profile
                  </Button>
                </>
              )}
            </div>
          </div>
          <Footer />
        </main>
      </ProtectedRoute>
    )
  }

  // Helper functions
  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `Joined ${date.toLocaleDateString()}`
  }

  return (
    <ProtectedRoute>
      <EmailConfirmationGuard>
        <main className="min-h-screen px-2.5">
          <Navbar />
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-6 lg:px-[165px] py-6">
        {/* Profile Info Card */}
        <div 
          className="w-full lg:w-[354px] p-4 rounded-2xl border"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          {/* Profile Picture */}
          <div className="relative w-20 h-20 mb-3">
            {profile.avatar_url ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Profile'}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ) : (
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-h6 font-bold"
                style={{ 
                  backgroundColor: '#D8F7D7',
                  color: '#119C21'
                }}
              >
                {getInitials(profile.full_name)}
              </div>
            )}
            <button 
              onClick={() => setShowAvatarUpload(true)}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2"
              style={{ 
                backgroundColor: '#119C21',
                borderColor: 'var(--bg-primary)'
              }}
            >
              <Camera className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-3">
            <h1 
              className="text-h5 font-bold mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {profile.full_name || 'Anonymous User'}
            </h1>
            <p 
              className="text-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              {profile.bio || 'No bio added yet.'}
            </p>
          </div>

          {/* Additional Info */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2">
              <Calendar 
                className="w-4 h-4" 
                style={{ color: 'var(--text-secondary)' }}
                strokeWidth={1.5}
              />
              <span 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                {formatDate(profile.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin 
                className="w-4 h-4" 
                style={{ color: 'var(--text-secondary)' }}
                strokeWidth={1.5}
              />
              <span 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile.location_name || 'Location not set'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <div 
                className="text-h6 font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {stats?.total_swaps || 0}
              </div>
              <div 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Swaps
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-h6 font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {stats?.active_items || 0}
              </div>
              <div 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Items
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span 
                  className="text-h6 font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {stats?.rating_average?.toFixed(1) || '0.0'}
                </span>
                <Star 
                  className="w-4 h-4 fill-current" 
                  style={{ color: '#E1B517' }}
                  strokeWidth={1.5}
                />
              </div>
              <div 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Rating
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button 
            variant="outlined" 
            size="default" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="w-5 h-5" strokeWidth={1.5} />
            Edit Profile
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Tabs */}
          <div 
            className="flex border-b mb-6"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => setActiveTab('my-items')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'my-items' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'my-items' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'my-items' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'my-items' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                My Items
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'my-items' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {userItems.length}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('saved-items')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'saved-items' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'saved-items' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'saved-items' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'saved-items' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Saved Items
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'saved-items' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {savedItems.length}
                </span>
              </div>
            </button>
          </div>

          {/* Items Grid */}
          {currentLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pb-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="aspect-[170/220] bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
              {currentItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-body-large mb-4" style={{ color: 'var(--text-secondary)' }}>
                {activeTab === 'my-items' 
                  ? "You haven't added any items yet." 
                  : "You haven't saved any items yet."
                }
              </p>
              {activeTab === 'my-items' && (
                <Button variant="primary" onClick={openAddItem}>
                  Add Your First Item
                </Button>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={{
          name: profile.full_name || '',
          email: profile.email || '',
          bio: profile.bio || '',
          location: profile.location_name || ''
        }}
        onSave={handleSaveProfile}
      />

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAvatarUpload(false)}
          />
          <div 
            className="relative w-full max-w-md rounded-3xl p-6"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <h3 className="text-h5 font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Update Profile Picture
            </h3>
            <AvatarUpload
              currentImageUrl={profile.avatar_url}
              onUpload={handleAvatarUpload}
              onCancel={() => setShowAvatarUpload(false)}
            />
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={closeAddItem}
        onSuccess={() => {
          // Refresh user items after successful item creation
          refetchUserItems()
        }}
      />
      
          <Footer />
        </main>
      </EmailConfirmationGuard>
    </ProtectedRoute>
  )
}