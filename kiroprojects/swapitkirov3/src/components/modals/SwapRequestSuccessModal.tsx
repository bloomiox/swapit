'use client'

import React from 'react'
import { Check, MessageCircle, Eye } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface SwapRequestSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onViewRequests: () => void
  onContinueBrowsing: () => void
  itemTitle?: string
  isFreeItem?: boolean
}

export function SwapRequestSuccessModal({ 
  isOpen, 
  onClose, 
  onViewRequests,
  onContinueBrowsing,
  itemTitle = "the item",
  isFreeItem = false
}: SwapRequestSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[500px] mx-auto p-6 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#D8F7D7' }}
          >
            <Check 
              className="w-10 h-10" 
              style={{ color: '#119C21' }}
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-h4 font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {isFreeItem ? 'Item Claimed!' : 'Swap Request Sent!'}
          </h2>
          <p 
            className="text-body-normal"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isFreeItem 
              ? `You have successfully claimed "${itemTitle}". The owner will be notified and will contact you with pickup details.`
              : `Your swap request for "${itemTitle}" has been sent successfully. The owner will be notified and can respond to your request.`
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="large"
            className="w-full flex items-center justify-center gap-3"
            onClick={onViewRequests}
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
            {isFreeItem ? 'View My Claims' : 'View My Requests'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            className="w-full flex items-center justify-center gap-3"
            onClick={onContinueBrowsing}
          >
            <Eye className="w-5 h-5" strokeWidth={1.5} />
            Continue Browsing
          </Button>

          <button
            onClick={onClose}
            className="w-full py-3 text-body-normal hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}