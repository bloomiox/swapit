'use client'

import * as React from 'react'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ItemCard } from '@/components/ui/ItemCard'
import { OpenStreetMap } from '@/components/ui/OpenStreetMap'
import { LoginModal } from '@/components/modals/LoginModal'
import { SignUpModal } from '@/components/modals/SignUpModal'
import { OnboardingModal } from '@/components/modals/OnboardingModal'
import { SwapRequestModal } from '@/components/modals/SwapRequestModal'
import { SwapRequestSuccessModal } from '@/components/modals/SwapRequestSuccessModal'
import { EditItemModal } from '@/components/modals/EditItemModal'
import { BoostItemModal } from '@/components/modals/BoostItemModal'
import { useAuthModals } from '@/hooks/useAuthModals'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Star, 
  MessageCircle,
  Repeat,
  Smartphone,
  Smile,
  Edit,
  TrendingUp,
  MoreVertical,
  Heart
} from 'lucide-react'
import Link from 'next/link'

// Mock data for the item
const mockItem = {
  id: '1',
  title: 'Vintage Stool',
  description: 'Beautiful vintage film camera in perfect working condition. Great for photography enthusiasts!',
  condition: 'Like New',
  category: 'Electronics',
  isFree: false, // Set to true for free items, false for swap items
  images: [
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg'
  ],
  badges: [
    { text: 'For Swap', type: 'info', icon: 'repeat' },
    { text: 'Electronics', type: 'category', icon: 'smartphone' },
    { text: 'New Condition', type: 'condition', icon: 'smile' }
  ],
  publishedAt: 'Published at 19 Dec 2024 at 12:00 PM',
  location: 'Berkeley CA · 9.3km away',
  lookingFor: ['Books', 'Electronics', 'Sports & Fitness', 'Toys & Games'],
  owner: {
    name: 'John Doe',
    avatar: '/placeholder.jpg',
    rating: 4.5,
    swapCount: 24
  }
}

// Mock current user - in a real app, this would come from your auth context
const currentUser = {
  id: 'current-user-id',
  name: 'John Doe' // Same as item owner for demo purposes
}

// Mock related items
const relatedItems = [
  {
    id: '2',
    title: 'iPhone',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '3',
    title: 'Office Bag',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: true
  },
  {
    id: '4',
    title: 'Wooden table with stool',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '5',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  }
]

export default function ItemDetailsPage() {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const { isLoginOpen, isSignUpOpen, isOnboardingOpen, openLogin, openSignUp, openOnboarding, closeAll } = useAuthModals()
  
  // Mock authentication state - in a real app, this would come from your auth context/provider
  const [isAuthenticated, setIsAuthenticated] = React.useState(true) // Set to true to show owner features
  
  // Modal states
  const [isSwapRequestOpen, setIsSwapRequestOpen] = React.useState(false)
  const [isSwapSuccessOpen, setIsSwapSuccessOpen] = React.useState(false)
  const [isEditItemOpen, setIsEditItemOpen] = React.useState(false)
  const [isBoostItemOpen, setIsBoostItemOpen] = React.useState(false)
  const [showOwnerMenu, setShowOwnerMenu] = React.useState(false)
  
  // Item state
  const [itemData, setItemData] = React.useState(mockItem)
  const [isSaved, setIsSaved] = React.useState(false)
  
  // Check if current user is the item owner
  const isOwner = currentUser.name === itemData.owner.name
  
  const handleRequestSwap = () => {
    if (!isAuthenticated) {
      // User is not authenticated, redirect to sign up
      openSignUp()
    } else {
      if (mockItem.isFree) {
        // For free items, directly claim the item
        handleClaimItem()
      } else {
        // For swap items, open swap request modal
        setIsSwapRequestOpen(true)
      }
    }
  }

  const handleClaimItem = () => {
    // In a real app, this would make an API call to claim the free item
    console.log('Claiming free item:', mockItem.id)
    
    // Show success modal (we can reuse the swap success modal with different text)
    setIsSwapSuccessOpen(true)
  }

  const handleSendSwapRequest = (selectedItems: string[], message: string) => {
    // In a real app, this would make an API call to send the swap request
    console.log('Sending swap request:', { selectedItems, message, itemId: mockItem.id })
    
    // Close swap request modal and show success modal
    setIsSwapRequestOpen(false)
    setIsSwapSuccessOpen(true)
  }

  const handleViewRequests = () => {
    setIsSwapSuccessOpen(false)
    // Navigate to requests page - in a real app, use router.push('/requests')
    window.location.href = '/requests'
  }

  const handleContinueBrowsing = () => {
    setIsSwapSuccessOpen(false)
    // Navigate to browse page - in a real app, use router.push('/browse')
    window.location.href = '/browse'
  }

  const handleSaveItem = (updatedData: {
    title: string
    description: string
    condition: string
    category: string
    location: string
    isFree: boolean
  }) => {
    setItemData(prev => ({
      ...prev,
      ...updatedData
    }))
    console.log('Item updated:', updatedData)
  }

  const handleBoostItem = (boostData: {
    duration: number
    paymentMethod: string
  }) => {
    console.log('Item boosted:', boostData)
    // In a real app, this would make an API call to boost the item
  }

  const handleToggleSave = () => {
    setIsSaved(!isSaved)
    console.log(isSaved ? 'Item removed from saved' : 'Item saved')
    // In a real app, this would make an API call to save/unsave the item
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      
      {/* Header with Back Button */}
      <div className="px-4 md:px-6 lg:px-[165px] py-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/browse"
            className="inline-flex items-center gap-2 text-body-small-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </Link>
          
          {/* Owner Actions Menu */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowOwnerMenu(!showOwnerMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              </button>
              
              {/* Dropdown Menu */}
              {showOwnerMenu && (
                <div 
                  className="absolute right-0 top-12 w-48 py-2 rounded-xl border shadow-lg z-10"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <button
                    onClick={() => {
                      setIsEditItemOpen(true)
                      setShowOwnerMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                    <span 
                      className="text-body-small"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Edit Item
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsBoostItemOpen(true)
                      setShowOwnerMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span 
                      className="text-body-small"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Boost Item
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-[165px] pb-12">
        <div className="flex gap-6">
          {/* Left Column - Photos */}
          <div className="w-[354px] flex-shrink-0">
            {/* Main Image */}
            <div 
              className="w-full h-[400px] rounded-2xl overflow-hidden mb-4"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <img
                src={mockItem.images[selectedImageIndex]}
                alt={mockItem.title}
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2">
              {mockItem.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-10 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <img
                    src={image}
                    alt={`${mockItem.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: '#f0f0f0' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Item Information Card */}
            <div 
              className="p-4 rounded-2xl border relative"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              {/* Save/Favorite Button */}
              {!isOwner && (
                <button
                  onClick={handleToggleSave}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      isSaved 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              )}
              {/* Badges */}
              <div className="flex gap-1 mb-3">
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-caption-medium"
                  style={{ 
                    backgroundColor: mockItem.isFree ? '#D8F7D7' : '#E9F1FD',
                    color: mockItem.isFree ? '#416B40' : 'var(--text-primary)'
                  }}
                >
                  <Repeat className="w-3 h-3" />
                  {mockItem.isFree ? 'Drop it' : 'For Swap'}
                </div>
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-caption-medium"
                  style={{ 
                    backgroundColor: '#F9F9F9',
                    color: 'var(--text-primary)'
                  }}
                >
                  <Smartphone className="w-3 h-3" />
                  Electronics
                </div>
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-caption-medium"
                  style={{ 
                    backgroundColor: '#D8F7D7',
                    color: '#416B40'
                  }}
                >
                  <Smile className="w-3 h-3" />
                  New Condition
                </div>
              </div>

              {/* Title and Description */}
              <div className="mb-3">
                <h1 
                  className="text-h5 mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {itemData.title}
                </h1>
                <p 
                  className="text-body-small-regular"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {itemData.description}
                </p>
              </div>

              {/* Meta Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {mockItem.publishedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {mockItem.location}
                  </span>
                </div>
              </div>

              {/* Looking For Section / Action Button */}
              <div className="flex items-center gap-6 mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                {!itemData.isFree && (
                  <div className="flex-1">
                    <h3 
                      className="text-body-small-bold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Looking for
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {itemData.lookingFor.map((item, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 rounded-full text-caption-medium"
                          style={{ 
                            backgroundColor: '#F9F9F9',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {itemData.isFree && (
                  <div className="flex-1">
                    <p 
                      className="text-body-small-regular"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      This item is available for free! Claim it now.
                    </p>
                  </div>
                )}
                {!isOwner && (
                  <Button variant="primary" size="default" onClick={handleRequestSwap}>
                    {itemData.isFree ? 'Claim Item' : 'Request Swap'}
                  </Button>
                )}
                {isOwner && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outlined" 
                      size="default" 
                      onClick={() => setIsEditItemOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="primary" 
                      size="default" 
                      onClick={() => setIsBoostItemOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Boost
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div 
              className="h-[220px] rounded-2xl overflow-hidden relative"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <OpenStreetMap
                latitude={37.8715}
                longitude={-122.2730}
                zoom={14}
                className="rounded-2xl"
                markers={[
                  {
                    lat: 37.8715,
                    lng: -122.2730,
                    title: mockItem.title,
                    color: '#FD5F59'
                  }
                ]}
                showUserLocation={true}
              />
            </div>

            {/* Owner Profile Card */}
            <Link href={`/user/${mockItem.owner.name.toLowerCase().replace(' ', '-')}`}>
              <div 
                className="flex items-center gap-3 p-3 rounded-2xl border hover:shadow-cards transition-shadow cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {/* Avatar */}
                <div 
                  className="w-10 h-10 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <img
                    src={mockItem.owner.avatar}
                    alt={mockItem.owner.name}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: '#f0f0f0' }}
                  />
                </div>

                {/* Owner Info */}
                <div className="flex-1">
                  <h4 
                    className="text-body-normal-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {mockItem.owner.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" style={{ color: '#E1B517' }} />
                    <span 
                      className="text-caption-regular"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {mockItem.owner.rating}
                    </span>
                    <span 
                      className="text-caption-regular"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      ({mockItem.owner.swapCount} swaps)
                    </span>
                  </div>
                </div>

                {/* Chat Button */}
                <Link href="/chat">
                  <button 
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: 'var(--bg-primary)' }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Navigate to chat page
                      window.location.href = '/chat'
                    }}
                  >
                    <MessageCircle className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </Link>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Explore More Section */}
      <div className="px-4 md:px-6 lg:px-[165px] pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              {/* Shop icon placeholder */}
              <div className="w-8 h-8 rounded bg-primary"></div>
            </div>
            <h2 
              className="text-h5"
              style={{ color: 'var(--text-primary)' }}
            >
              Explore More
            </h2>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 rotate-180" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Related Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {relatedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <Footer />

      {/* Auth Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeAll} 
        onSwitchToSignup={openSignUp} 
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={closeAll} 
        onSwitchToLogin={openLogin}
        onSignUpSuccess={openOnboarding}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={closeAll}
        onComplete={closeAll}
      />

      {/* Swap Request Modals */}
      <SwapRequestModal
        isOpen={isSwapRequestOpen}
        onClose={() => setIsSwapRequestOpen(false)}
        onSendRequest={handleSendSwapRequest}
      />
      <SwapRequestSuccessModal
        isOpen={isSwapSuccessOpen}
        onClose={() => setIsSwapSuccessOpen(false)}
        onViewRequests={handleViewRequests}
        onContinueBrowsing={handleContinueBrowsing}
        itemTitle={itemData.title}
        isFreeItem={itemData.isFree}
      />

      {/* Owner Modals */}
      {isOwner && (
        <>
          <EditItemModal
            isOpen={isEditItemOpen}
            onClose={() => setIsEditItemOpen(false)}
            currentItem={{
              id: itemData.id,
              title: itemData.title,
              description: itemData.description,
              condition: itemData.condition,
              category: itemData.category,
              location: itemData.location,
              isFree: itemData.isFree,
              image: itemData.images[0]
            }}
            onSaveItem={handleSaveItem}
          />
          <BoostItemModal
            isOpen={isBoostItemOpen}
            onClose={() => setIsBoostItemOpen(false)}
            itemTitle={itemData.title}
            onSuccess={() => console.log('Item boosted successfully!')}
          />
        </>
      )}
    </main>
  )
}