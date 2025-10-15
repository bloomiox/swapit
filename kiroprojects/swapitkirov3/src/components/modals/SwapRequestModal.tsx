'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUserItems } from '@/hooks/useItems'
import { useSwapRequestActions } from '@/hooks/useSwapRequests'

interface SwapRequestModalProps {
  isOpen: boolean
  onClose: () => void
  requestedItemId: string
  isClaimRequest?: boolean
  onSuccess?: () => void
}

export function SwapRequestModal({ 
  isOpen, 
  onClose, 
  requestedItemId,
  isClaimRequest = false,
  onSuccess
}: SwapRequestModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Data hooks
  const { items: userItems, loading: itemsLoading } = useUserItems()
  const { createSwapRequest } = useSwapRequestActions()

  const filteredItems = userItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleItemSelect = (itemId: string) => {
    if (isClaimRequest) {
      // For claim requests, don't allow item selection
      return
    }
    
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [itemId] // Only allow one item selection for now
    )
  }

  const handleSendRequest = async () => {
    try {
      setLoading(true)
      
      await createSwapRequest({
        requested_item_id: requestedItemId,
        offered_item_id: isClaimRequest ? undefined : selectedItems[0],
        message: message.trim() || undefined,
        is_claim_request: isClaimRequest
      })

      // Reset form
      setSelectedItems([])
      setMessage('')
      setSearchQuery('')
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error sending swap request:', error)
      // TODO: Show error toast
    } finally {
      setLoading(false)
    }
  }

  const canSendRequest = isClaimRequest || selectedItems.length > 0

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 
            className="text-h6 font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {isClaimRequest ? 'Request Free Item' : 'Select items to offer'}
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Search Bar - Only show for swap requests, not claim requests */}
        {!isClaimRequest && (
          <div className="p-4">
            <div 
              className="flex items-center gap-3 px-4 py-3 border rounded-2xl"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)'
              }}
            >
              <Search className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              <input
                type="text"
                placeholder="Search an item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-body-normal"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        )}

        {/* Items Grid - Only show for swap requests, not claim requests */}
        {!isClaimRequest && (
          <div className="px-4 pb-4">
            {itemsLoading ? (
              <div className="flex gap-2 overflow-x-auto">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[175px] border rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="p-1">
                      <div className="aspect-[167/220] rounded-xl bg-gray-200"></div>
                    </div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemSelect(item.id)}
                    className={`flex-shrink-0 w-[175px] border rounded-2xl overflow-hidden cursor-pointer transition-all ${
                      selectedItems.includes(item.id) 
                        ? 'border-primary border-2' 
                        : 'border-border-color hover:border-primary/50'
                    }`}
                    style={{ 
                      backgroundColor: 'var(--bg-card)',
                      borderColor: selectedItems.includes(item.id) ? '#119C21' : 'var(--border-color)'
                    }}
                  >
                    {/* Image Container */}
                    <div className="p-1">
                      <div className="relative aspect-[167/220] rounded-xl overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full bg-gray-200 flex items-center justify-center"
                            style={{ backgroundColor: '#f0f0f0' }}
                          >
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                        
                        {/* Free Badge */}
                        {item.is_free && (
                          <div 
                            className="absolute top-1 right-1 px-2 py-1 rounded-full"
                            style={{ backgroundColor: '#119C21' }}
                          >
                            <span 
                              className="text-caption-medium text-white"
                            >
                              FREE
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 
                        className="text-body-small font-bold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-body-normal" style={{ color: 'var(--text-secondary)' }}>
                  You don't have any items to offer yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Message Input */}
        <div className="px-4 pb-4">
          <div className="space-y-2">
            <label 
              className="text-body-normal font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Message (optional)
            </label>
            <textarea
              placeholder={isClaimRequest ? "Why would you like this item?" : "Anything you'd like to say..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border rounded-2xl resize-none outline-none text-body-normal"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)'
          }}
        >
          <Button
            variant="primary"
            size="large"
            className="w-full"
            onClick={handleSendRequest}
            disabled={!canSendRequest || loading}
          >
            {loading ? 'Sending...' : isClaimRequest ? 'Send Claim Request' : 'Send Swap Request'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}