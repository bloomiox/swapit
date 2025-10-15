'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

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
import { ImageGalleryModal } from '@/components/modals/ImageGalleryModal'
import { useAuthModals } from '@/hooks/useAuthModals'
import { useItem, useItemActions } from '@/hooks/useItems'
import { useCategories } from '@/hooks/useCategories'
import { useAuth } from '@/contexts/AuthContext'
import { useChatActions } from '@/hooks/useChat'
import { useSwapRequestActions } from '@/hooks/useSwapRequests'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Star, 
  MessageCircle,
  Repeat,
  Smile,
  Edit,
  TrendingUp,
  MoreVertical,
  Heart
} from 'lucide-react'
import Link from 'next/link'



export default function ItemDetailsPage() {
  const params = useParams()
  const itemId = params.id as string
  
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const { isLoginOpen, isSignUpOpen, isOnboardingOpen, openLogin, openSignUp, openOnboarding, closeAll } = useAuthModals()
  
  // Auth and data hooks
  const { user } = useAuth()
  const { item, loading, error, refetch } = useItem(itemId)
  // Related items - only load after main item is loaded
  const [relatedItems, setRelatedItems] = React.useState<any[]>([])
  const [relatedItemsLoading, setRelatedItemsLoading] = React.useState(false)
  
  React.useEffect(() => {
    if (item && item.category_id && !loading) {
      setRelatedItemsLoading(true)
      // Fetch related items manually to avoid infinite loops
      supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, icon),
          user:users(id, full_name, avatar_url, rating_average)
        `)
        .eq('is_available', true)
        .eq('category_id', item.category_id)
        .neq('id', item.id) // Exclude current item
        .order('created_at', { ascending: false })
        .limit(4)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching related items:', error)
          } else {
            setRelatedItems(data || [])
          }
          setRelatedItemsLoading(false)
        })
    }
  }, [item, loading])
  const { saveItem, unsaveItem, checkIfSaved, updateItem } = useItemActions()
  const { categories } = useCategories()
  const { createOrGetConversation } = useChatActions()
  const { createSwapRequest } = useSwapRequestActions()
  
  // Modal states
  const [isSwapRequestOpen, setIsSwapRequestOpen] = React.useState(false)
  const [isSwapSuccessOpen, setIsSwapSuccessOpen] = React.useState(false)
  const [isEditItemOpen, setIsEditItemOpen] = React.useState(false)
  const [isBoostItemOpen, setIsBoostItemOpen] = React.useState(false)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = React.useState(false)
  const [showOwnerMenu, setShowOwnerMenu] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [justSaved, setJustSaved] = React.useState(false)
  const [startingChat, setStartingChat] = React.useState(false)
  
  // Check if current user is the item owner
  const isOwner = user && item && user.id === item.user_id
  const isAuthenticated = !!user

  // Check if item is saved on load
  React.useEffect(() => {
    if (item && user && !loading) {
      checkIfSaved(item.id).then(setIsSaved).catch(console.error)
    }
  }, [item, user, loading, checkIfSaved])

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="px-4 md:px-6 lg:px-[165px] py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="flex gap-6">
              <div className="w-[354px] h-[400px] bg-gray-200 rounded-2xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Error state
  if (error || !item) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="px-4 md:px-6 lg:px-[165px] py-12">
          <div className="text-center">
            <h1 className="text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>
              Item Not Found
            </h1>
            <p className="text-body-large mb-6" style={{ color: 'var(--text-secondary)' }}>
              {error || 'The item you are looking for does not exist or has been removed.'}
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

  // Related items are already filtered and limited in the useEffect
  
  const handleRequestSwap = () => {
    if (!isAuthenticated) {
      openSignUp()
    } else {
      if (item.is_free) {
        handleClaimItem()
      } else {
        setIsSwapRequestOpen(true)
      }
    }
  }

  const handleClaimItem = async () => {
    try {
      console.log('Claiming free item:', item.id)
      await createSwapRequest({
        requested_item_id: item.id,
        is_claim_request: true,
        message: 'I would like to claim this free item.'
      })
      setIsSwapSuccessOpen(true)
    } catch (error) {
      console.error('Error claiming item:', error)
      alert('Failed to claim item. Please try again.')
    }
  }

  const handleSwapRequestSuccess = () => {
    setIsSwapRequestOpen(false)
    setIsSwapSuccessOpen(true)
  }

  const handleViewRequests = () => {
    setIsSwapSuccessOpen(false)
    window.location.href = '/requests'
  }

  const handleContinueBrowsing = () => {
    setIsSwapSuccessOpen(false)
    window.location.href = '/browse'
  }

  const handleSaveItem = async (updatedData: any) => {
    try {
      // Find the category ID from the category name
      const category = categories.find(cat => cat.name === updatedData.category)
      
      // Map the form data to the database fields
      const updates = {
        title: updatedData.title,
        description: updatedData.description,
        condition: updatedData.condition, // Already in correct format (like_new, good, etc.)
        is_free: updatedData.isFree,
        location_name: updatedData.location,
        category_id: category?.id || null
      }
      
      await updateItem(item.id, updates)
      console.log('Item updated successfully:', updatedData)
      refetch() // Refresh item data
    } catch (error) {
      console.error('Error updating item:', error)
      // Optionally show an error toast here
    }
  }



  const handleToggleSave = async () => {
    if (!user || !item || isSaving) return
    
    // If user is not authenticated, open login modal
    if (!isAuthenticated) {
      openLogin()
      return
    }
    
    setIsSaving(true)
    
    try {
      if (isSaved) {
        await unsaveItem(item.id)
        setIsSaved(false)
      } else {
        await saveItem(item.id)
        setIsSaved(true)
        // Show success animation
        setJustSaved(true)
        setTimeout(() => setJustSaved(false), 1000)
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      // Optionally show an error toast here
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartChat = async () => {
    if (!user || !item?.user?.id || startingChat) return

    // If user is not authenticated, open login modal
    if (!isAuthenticated) {
      openLogin()
      return
    }

    try {
      setStartingChat(true)
      const conversationId = await createOrGetConversation(item.user.id)
      // Navigate to chat with the conversation ID
      window.location.href = `/chat?conversation=${conversationId}`
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Failed to start chat. Please try again.')
    } finally {
      setStartingChat(false)
    }
  }

  // Format condition for display
  const formatCondition = (condition: string) => {
    switch (condition) {
      case 'like_new': return 'Like New'
      case 'good': return 'Good'
      case 'fair': return 'Fair'
      case 'poor': return 'Poor'
      default: return condition
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `Published at ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
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
            <button
              onClick={() => item.images && item.images.length > 0 && setIsImageGalleryOpen(true)}
              className="w-full h-[400px] rounded-2xl overflow-hidden mb-4 relative cursor-pointer hover:opacity-95 transition-opacity"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              disabled={!item.images || item.images.length === 0}
            >
              {item.images && item.images.length > 0 ? (
                <Image
                  src={item.images[selectedImageIndex]}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="354px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </button>

            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="flex gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    onDoubleClick={() => {
                      setSelectedImageIndex(index)
                      setIsImageGalleryOpen(true)
                    }}
                    className={`w-10 h-16 rounded-lg overflow-hidden border-2 transition-colors relative ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                    title="Click to select, double-click to open gallery"
                  >
                    <Image
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Item Information Card */}
            <div 
              className={`p-4 rounded-2xl border relative ${item.is_boosted ? 'border-2' : ''}`}
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: item.is_boosted ? '#FFC107' : 'var(--border-color)'
              }}
            >
              {/* Save/Favorite Button */}
              {!isOwner && (
                <button
                  onClick={handleToggleSave}
                  disabled={isSaving}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isSaving 
                      ? 'cursor-not-allowed opacity-70' 
                      : 'hover:bg-gray-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                  title={isSaved ? 'Remove from saved items' : 'Save item'}
                >
                  <Heart 
                    className={`w-5 h-5 transition-all duration-200 ${
                      isSaved 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    } ${isSaving ? 'animate-pulse' : ''} ${
                      justSaved ? 'animate-bounce scale-125' : ''
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
                    backgroundColor: item.is_free ? '#D8F7D7' : '#E9F1FD',
                    color: item.is_free ? '#416B40' : 'var(--text-primary)'
                  }}
                >
                  <Repeat className="w-3 h-3" />
                  {item.is_free ? 'Free' : 'For Swap'}
                </div>
                {item.is_boosted && (
                  <div 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-caption-medium"
                    style={{ 
                      backgroundColor: '#FFF3CD',
                      color: '#856404'
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Boosted
                  </div>
                )}
                {item.category && (
                  <div 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-caption-medium"
                    style={{ 
                      backgroundColor: '#F9F9F9',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span className="text-xs">{item.category.icon || '📦'}</span>
                    {item.category.name}
                  </div>
                )}
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-caption-medium"
                  style={{ 
                    backgroundColor: '#D8F7D7',
                    color: '#416B40'
                  }}
                >
                  <Smile className="w-3 h-3" />
                  {formatCondition(item.condition)}
                </div>
              </div>

              {/* Title and Description */}
              <div className="mb-3">
                <h1 
                  className="text-h5 mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h1>
                <p 
                  className="text-body-small-regular"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.description}
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
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.location_name || 'Location not set'}
                  </span>
                </div>
              </div>

              {/* Looking For Section / Action Button */}
              <div className="flex items-center gap-6 mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                {!item.is_free && (
                  <div className="flex-1">
                    <h3 
                      className="text-body-small-bold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Looking for
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      <div
                        className="px-2 py-1 rounded-full text-caption-medium"
                        style={{ 
                          backgroundColor: '#F9F9F9',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Open to offers
                      </div>
                    </div>
                  </div>
                )}
                {item.is_free && (
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
                    {item.is_free ? 'Claim Item' : 'Request Swap'}
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
              className="rounded-2xl overflow-hidden relative border"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                height: '280px'
              }}
            >
              <div className="absolute top-4 left-4 z-10">
                <div 
                  className="px-3 py-2 rounded-lg backdrop-blur-sm border"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <span 
                      className="text-body-small-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Item Location
                    </span>
                  </div>
                  <p 
                    className="text-caption-regular mt-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.location_name || 'Location not set'}
                  </p>
                </div>
              </div>
              
              {item.location_coordinates ? (
                <OpenStreetMap
                  latitude={item.location_coordinates.lat}
                  longitude={item.location_coordinates.lng}
                  zoom={15}
                  className="w-full h-full"
                  markers={[
                    {
                      lat: item.location_coordinates.lat,
                      lng: item.location_coordinates.lng,
                      title: item.title,
                      id: item.id,
                      imageUrl: item.images?.[0],
                      isFree: item.is_free
                    }
                  ]}
                  showUserLocation={true}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-500 text-center">
                    Location not available<br />
                    <span className="text-sm">Contact owner for pickup details</span>
                  </span>
                </div>
              )}
            </div>

            {/* Owner Profile Card */}
            {item.user && (
              <Link href={`/user/${item.user.id}`}>
                <div 
                  className="flex items-center gap-3 p-3 rounded-2xl border hover:shadow-cards transition-shadow cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  {/* Avatar */}
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden relative"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    {item.user.avatar_url ? (
                      <Image
                        src={item.user.avatar_url}
                        alt={item.user.full_name || 'User'}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">
                          {(item.user.full_name || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Owner Info */}
                  <div className="flex-1">
                    <h4 
                      className="text-body-normal-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.user.full_name || 'Anonymous User'}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" style={{ color: '#E1B517' }} />
                      <span 
                        className="text-caption-regular"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.user.rating_average || 0}
                      </span>
                      <span 
                        className="text-caption-regular"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        (New user)
                      </span>
                    </div>
                  </div>

                  {/* Chat Button */}
                  {!isOwner && (
                    <button 
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: 'var(--bg-primary)' }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleStartChat()
                      }}
                      disabled={startingChat}
                      title={startingChat ? 'Starting chat...' : 'Message owner'}
                    >
                      <MessageCircle className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </button>
                  )}
                </div>
              </Link>
            )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedItemsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse" />
            ))
          ) : relatedItems.length > 0 ? (
            relatedItems.map((relatedItem) => (
              <ItemCard key={relatedItem.id} item={relatedItem} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
                No related items found.
              </p>
            </div>
          )}
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
        onComplete={() => {
          closeAll()
          window.location.href = '/browse'
        }}
      />

      {/* Swap Request Modals */}
      <SwapRequestModal
        isOpen={isSwapRequestOpen}
        onClose={() => setIsSwapRequestOpen(false)}
        requestedItemId={item.id}
        isClaimRequest={item.is_free}
        onSuccess={handleSwapRequestSuccess}
      />
      <SwapRequestSuccessModal
        isOpen={isSwapSuccessOpen}
        onClose={() => setIsSwapSuccessOpen(false)}
        onViewRequests={handleViewRequests}
        onContinueBrowsing={handleContinueBrowsing}
        itemTitle={item.title}
        isFreeItem={item.is_free}
      />

      {/* Owner Modals */}
      {isOwner && (
        <>
          <EditItemModal
            isOpen={isEditItemOpen}
            onClose={() => setIsEditItemOpen(false)}
            currentItem={{
              id: item.id,
              title: item.title,
              description: item.description,
              condition: item.condition,
              category: item.category?.name || 'Uncategorized',
              location: item.location_name || '',
              isFree: item.is_free,
              image: item.images?.[0] || ''
            }}
            onSaveItem={handleSaveItem}
          />
          <BoostItemModal
            isOpen={isBoostItemOpen}
            onClose={() => setIsBoostItemOpen(false)}
            itemTitle={item.title}
            onSuccess={() => console.log('Item boosted successfully!')}
          />
        </>
      )}

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isImageGalleryOpen}
        onClose={() => setIsImageGalleryOpen(false)}
        images={item.images || []}
        initialIndex={selectedImageIndex}
        itemTitle={item.title}
      />
    </main>
  )
}