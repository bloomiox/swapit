'use client'

import React, { useState } from 'react'
import { 
  RotateCcw
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/Button'
import { SwapRequestCard } from '@/components/ui/SwapRequestCard'
import { SentSwapRequestCard } from '@/components/ui/SentSwapRequestCard'
import { DropzoneRequestCard } from '@/components/ui/DropzoneRequestCard'
import { 
  useReceivedSwapRequests, 
  useSentSwapRequests, 
  useDropzoneRequests,
  useSwapRequestActions 
} from '@/hooks/useSwapRequests'
import { usePendingReviews, useReviewActions } from '@/hooks/useReviews'
import { useChatActions } from '@/hooks/useChat'
import { ReviewModal } from '@/components/modals/ReviewModal'

type TabType = 'received' | 'sent' | 'dropzone'

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('received')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedSwapForReview, setSelectedSwapForReview] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Data hooks
  const { requests: receivedRequests, loading: receivedLoading, refetch: refetchReceived } = useReceivedSwapRequests()
  const { requests: sentRequests, loading: sentLoading, refetch: refetchSent } = useSentSwapRequests()
  const { requests: dropzoneRequests, loading: dropzoneLoading, refetch: refetchDropzone } = useDropzoneRequests()
  const { pendingReviews, refetch: refetchPendingReviews } = usePendingReviews()
  
  // Actions hooks
  const { acceptSwapRequest, rejectSwapRequest } = useSwapRequestActions()
  const { createReview } = useReviewActions()
  const { createOrGetConversation } = useChatActions()

  const handleAccept = async (requestId: string) => {
    try {
      await acceptSwapRequest(requestId)
      refetchReceived()
      refetchPendingReviews()
      
      // Show review modal after accepting
      const acceptedRequest = receivedRequests.find(req => req.id === requestId)
      if (acceptedRequest) {
        setSelectedSwapForReview({
          id: acceptedRequest.id,
          reviewee_id: acceptedRequest.requester_id,
          reviewee: acceptedRequest.requester,
          requested_item: acceptedRequest.requested_item,
          offered_item: acceptedRequest.offered_item
        })
        setReviewModalOpen(true)
      }
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      await rejectSwapRequest(requestId)
      refetchReceived()
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const handleMessage = async (requestId: string) => {
    try {
      // Find the request to get the owner/requester info and item details
      let request
      let otherUserId
      let itemId
      
      if (activeTab === 'sent') {
        request = sentRequests.find(req => req.id === requestId)
        otherUserId = request?.owner_id
        itemId = request?.requested_item?.id
      } else if (activeTab === 'received') {
        request = receivedRequests.find(req => req.id === requestId)
        otherUserId = request?.requester_id
        itemId = request?.requested_item?.id
      } else if (activeTab === 'dropzone') {
        request = dropzoneRequests.find(req => req.id === requestId)
        otherUserId = request?.owner_id
        itemId = request?.requested_item?.id
      }
      
      if (!otherUserId || !itemId) {
        console.error('Could not find user or item information for request:', requestId)
        return
      }
      
      // Create or get conversation with the other user
      const conversationId = await createOrGetConversation(otherUserId)
      
      // Navigate to chat with conversation and item reference
      window.location.href = `/chat?conversation=${conversationId}&item=${itemId}`
      
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  const handleReview = (requestId: string) => {
    const request = receivedRequests.find(req => req.id === requestId)
    if (request) {
      setSelectedSwapForReview({
        id: request.id,
        reviewee_id: request.requester_id,
        reviewee: request.requester,
        requested_item: request.requested_item,
        offered_item: request.offered_item
      })
      setReviewModalOpen(true)
    }
  }

  const handleSubmitReview = async (reviewData: any) => {
    try {
      // Create the review first
      await createReview(reviewData)
      
      // Close modal immediately for better UX
      setReviewModalOpen(false)
      setSelectedSwapForReview(null)
      
      // Show success feedback
      console.log('Review submitted successfully!')
      
      // Refresh data in the background
      // Use setTimeout to ensure the review is fully committed before refetching
      setTimeout(async () => {
        try {
          await Promise.all([
            refetchPendingReviews(),
            refetchReceived(),
            refetchSent(),
            refetchDropzone()
          ])
          // Force re-render of components
          setRefreshKey(prev => prev + 1)
        } catch (refetchError) {
          console.error('Error refreshing data after review submission:', refetchError)
        }
      }, 1000) // Increased delay to ensure database consistency
      
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'received':
        return { requests: receivedRequests, loading: receivedLoading }
      case 'sent':
        return { requests: sentRequests, loading: sentLoading }
      case 'dropzone':
        return { requests: dropzoneRequests, loading: dropzoneLoading }
      default:
        return { requests: receivedRequests, loading: receivedLoading }
    }
  }

  const { requests: currentRequests, loading: currentLoading } = getCurrentData()

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-2.5">
        <Navbar />
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="px-4 md:px-6 lg:px-[165px] py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 
              className="text-h3 font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Swap Requests
            </h1>
          </div>

          {/* Tabs */}
          <div 
            className="flex border-b mb-6"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => setActiveTab('received')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'received' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'received' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'received' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'received' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Received
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'received' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {receivedRequests.length}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'sent' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'sent' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'sent' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'sent' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Sent
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'sent' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {sentRequests.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('dropzone')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'dropzone' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'dropzone' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'dropzone' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'dropzone' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Dropzone
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'dropzone' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {dropzoneRequests.length}
                </span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            {currentLoading ? (
              <div className="space-y-2">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-4 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-32 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentRequests.length > 0 ? (
              currentRequests.map((request) => {
                if (activeTab === 'sent') {
                  return (
                    <SentSwapRequestCard
                      key={request.id}
                      request={request}
                      onMessage={handleMessage}
                    />
                  )
                } else if (activeTab === 'dropzone') {
                  return (
                    <DropzoneRequestCard
                      key={request.id}
                      request={request}
                      onMessage={handleMessage}
                    />
                  )
                } else {
                  return (
                    <SwapRequestCard
                      key={`${request.id}-${refreshKey}`}
                      request={request}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onMessage={handleMessage}
                      onReview={handleReview}
                    />
                  )
                }
              })
            ) : (
              <div className="text-center py-16">
                <div className="mb-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  >
                    <RotateCcw className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </div>
                <h3 
                  className="text-h6 font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  No {activeTab} requests
                </h3>
                <p 
                  className="text-body-normal"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {activeTab === 'received' && 'When others request to swap with your items, they\'ll appear here'}
                  {activeTab === 'sent' && 'Requests you\'ve sent to other users will appear here'}
                  {activeTab === 'dropzone' && 'Free items you\'ve requested will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Reviews Section */}
        {pendingReviews.length > 0 && (
          <div className="mt-8">
            <h2 
              className="text-h5 font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Pending Reviews
            </h2>
            <div className="space-y-2">
              {pendingReviews.map((swap) => (
                <div
                  key={swap.id}
                  className="p-4 rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {swap.reviewee.avatar_url ? (
                        <img
                          src={swap.reviewee.avatar_url}
                          alt={swap.reviewee.full_name || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ 
                            backgroundColor: '#D8F7D7',
                            color: '#119C21'
                          }}
                        >
                          {(swap.reviewee.full_name || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 
                          className="text-body-normal font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Review {swap.reviewee.full_name || 'Anonymous User'}
                        </h3>
                        <p 
                          className="text-body-small"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Swap completed - Please leave a review
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="default"
                      onClick={() => {
                        setSelectedSwapForReview(swap)
                        setReviewModalOpen(true)
                      }}
                    >
                      Leave Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* Review Modal */}
      {selectedSwapForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false)
            setSelectedSwapForReview(null)
          }}
          swapRequest={selectedSwapForReview}
          onSubmitReview={handleSubmitReview}
        />
      )}
      </main>
    </ProtectedRoute>
  )
}