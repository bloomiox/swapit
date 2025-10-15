'use client'

import * as React from 'react'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ItemCard } from '@/components/ui/ItemCard'
import { ReportUserModal } from '@/components/modals/ReportUserModal'
import { useUserProfile, useUserStats } from '@/hooks/useUserProfile'
import { useUserReviews, useReviewStats } from '@/hooks/useReviews'
import { useUserItems } from '@/hooks/useItems'
import { useAuth } from '@/contexts/AuthContext'
import { useChatActions } from '@/hooks/useChat'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Star, 
  MessageCircle,
  ArrowRight,
  MoreVertical,
  Flag,
  UserX,
} from 'lucide-react'
import Link from 'next/link'



export default function UserDetailsPage() {
  const params = useParams()
  const userId = params.id as string
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<'items' | 'reviews'>('items')

  // Auth and data hooks
  const { user: currentUser } = useAuth()
  const { profile, loading: profileLoading, error: profileError } = useUserProfile(userId)
  const { stats, loading: statsLoading } = useUserStats(userId)
  const { items: userItems, loading: itemsLoading } = useUserItems(userId)
  const { reviews, loading: reviewsLoading } = useUserReviews(userId)
  const { stats: reviewStats } = useReviewStats(userId)
  const { createOrGetConversation } = useChatActions()

  const [startingChat, setStartingChat] = useState(false)

  const handleReportUser = (report: {
    reason: string
    description: string
    blockUser: boolean
  }) => {
    console.log('Report submitted:', report)
    if (report.blockUser) {
      console.log('User blocked')
    }
  }

  const handleBlockUser = () => {
    console.log('User blocked directly')
    setShowUserMenu(false)
  }



  const handleStartChat = async () => {
    if (!currentUser || !userId || startingChat) return

    try {
      setStartingChat(true)
      const conversationId = await createOrGetConversation(userId)
      // Navigate to chat with the conversation ID
      window.location.href = `/chat?conversation=${conversationId}`
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Failed to start chat. Please try again.')
    } finally {
      setStartingChat(false)
    }
  }

  // Loading state
  if (profileLoading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="px-4 md:px-6 lg:px-[165px] py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="flex gap-6">
              <div className="w-[354px] h-96 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="aspect-[170/220] bg-gray-200 rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Error state
  if (profileError || !profile) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="px-4 md:px-6 lg:px-[165px] py-12">
          <div className="text-center">
            <h1 className="text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>
              User Not Found
            </h1>
            <p className="text-body-large mb-6" style={{ color: 'var(--text-secondary)' }}>
              The user you are looking for does not exist or has been removed.
            </p>
            <Link href="/browse">
              <Button variant="primary">Browse Items</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
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
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      
      {/* Header with Back Button */}
      <div className="px-4 md:px-6 lg:px-[165px] py-6">
        <Link 
          href="/browse"
          className="inline-flex items-center gap-2 text-body-small-bold hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-primary)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Browse
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-[165px] pb-12">
        <div className="flex gap-6">
          {/* Left Column - User Info */}
          <div className="w-[354px] flex-shrink-0">
            <div 
              className="p-4 rounded-2xl border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              {/* Profile Picture */}
              <div className="flex justify-center mb-3">
                {profile.avatar_url ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden relative">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
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
              </div>

              {/* Name and Menu */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 text-center">
                  <h1 
                    className="text-h5 font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {profile.full_name || 'Anonymous User'}
                  </h1>
                  {profile.bio && (
                    <p 
                      className="text-body-small mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {profile.bio}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div 
                      className="absolute right-0 top-10 w-48 py-2 rounded-xl border shadow-lg z-10"
                      style={{ 
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <button
                        onClick={() => {
                          setIsReportModalOpen(true)
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <Flag className="w-4 h-4 text-red-500" />
                        <span 
                          className="text-body-small"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Report User
                        </span>
                      </button>
                      <button
                        onClick={handleBlockUser}
                        className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <UserX className="w-4 h-4 text-red-500" />
                        <span 
                          className="text-body-small"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Block User
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {formatDate(profile.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {profile.location_name || 'Location not set'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-stretch gap-4 mb-4">
                <div className="flex-1 text-center">
                  <div 
                    className="text-h6 font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stats?.total_swaps || 0}
                  </div>
                  <div 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Swaps
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div 
                    className="text-h6 font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stats?.active_items || 0}
                  </div>
                  <div 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Items
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span 
                      className="text-h6 font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {reviewStats?.average_rating?.toFixed(1) || '0.0'}
                    </span>
                    <Star className="w-4 h-4 fill-current" style={{ color: '#E1B517' }} />
                  </div>
                  <div 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ({reviewStats?.total_reviews || 0} reviews)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {currentUser && currentUser.id !== userId && (
                  <Button
                    variant="outlined"
                    size="default"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleStartChat}
                    disabled={startingChat}
                  >
                    <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                    {startingChat ? 'Starting Chat...' : 'Message'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div 
              className="flex border-b mb-6"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <button
                onClick={() => setActiveTab('items')}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === 'items' 
                    ? 'border-primary' 
                    : 'border-transparent'
                }`}
                style={{
                  borderBottomColor: activeTab === 'items' ? '#119C21' : 'transparent'
                }}
              >
                <span 
                  className={`text-body-small font-${activeTab === 'items' ? 'bold' : 'medium'}`}
                  style={{ 
                    color: activeTab === 'items' ? '#119C21' : 'var(--text-secondary)' 
                  }}
                >
                  Items
                </span>
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: activeTab === 'items' ? '#119C21' : 'var(--text-secondary)'
                  }}
                >
                  <span className="text-xs font-medium text-white">
                    {userItems.length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === 'reviews' 
                    ? 'border-primary' 
                    : 'border-transparent'
                }`}
                style={{
                  borderBottomColor: activeTab === 'reviews' ? '#119C21' : 'transparent'
                }}
              >
                <span 
                  className={`text-body-small font-${activeTab === 'reviews' ? 'bold' : 'medium'}`}
                  style={{ 
                    color: activeTab === 'reviews' ? '#119C21' : 'var(--text-secondary)' 
                  }}
                >
                  Reviews
                </span>
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: activeTab === 'reviews' ? '#119C21' : 'var(--text-secondary)'
                  }}
                >
                  <span className="text-xs font-medium text-white">
                    {reviews.length}
                  </span>
                </div>
              </button>
            </div>

            {/* Content */}
            {activeTab === 'items' ? (
              /* Items Grid */
              itemsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="aspect-[170/220] bg-gray-200 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : userItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
                    This user hasn't added any items yet.
                  </p>
                </div>
              )
            ) : (
              /* Reviews List */
              reviewsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="p-4 rounded-2xl border"
                      style={{ 
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {review.reviewer && !review.is_anonymous ? (
                          <>
                            {review.reviewer.avatar_url ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image
                                  src={review.reviewer.avatar_url}
                                  alt={review.reviewer.full_name || 'Reviewer'}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                            ) : (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ 
                                  backgroundColor: '#D8F7D7',
                                  color: '#119C21'
                                }}
                              >
                                {getInitials(review.reviewer.full_name)}
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-body-small-bold" style={{ color: 'var(--text-primary)' }}>
                                {review.reviewer.full_name || 'Anonymous'}
                              </h4>
                              <div className="flex items-center gap-1">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="text-caption ml-1" style={{ color: 'var(--text-secondary)' }}>
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                              style={{ 
                                backgroundColor: '#F0F0F0',
                                color: '#666'
                              }}
                            >
                              ?
                            </div>
                            <div className="flex-1">
                              <h4 className="text-body-small-bold" style={{ color: 'var(--text-primary)' }}>
                                Anonymous User
                              </h4>
                              <div className="flex items-center gap-1">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="text-caption ml-1" style={{ color: 'var(--text-secondary)' }}>
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {review.comment && (
                        <p className="text-body-small" style={{ color: 'var(--text-primary)' }}>
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
                    No reviews yet.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Report User Modal */}
      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedUser={{
          name: profile.full_name || 'Anonymous User',
          initials: getInitials(profile.full_name)
        }}
        onSubmitReport={handleReportUser}
      />



      <Footer />
    </main>
  )
}