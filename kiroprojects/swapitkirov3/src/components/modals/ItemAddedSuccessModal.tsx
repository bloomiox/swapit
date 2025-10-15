'use client'

import React from 'react'
import { Check, Eye, TrendingUp } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ItemAddedSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onViewItem: () => void
  onBoostItem: () => void
  itemTitle?: string
}

export function ItemAddedSuccessModal({ 
  isOpen, 
  onClose, 
  onViewItem, 
  onBoostItem,
  itemTitle = "Your Item"
}: ItemAddedSuccessModalProps) {
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
            Item Added Successfully!
          </h2>
          <p 
            className="text-body-normal"
            style={{ color: 'var(--text-secondary)' }}
          >
            "{itemTitle}" has been added to your listings and is now visible to other users.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="large"
            className="w-full flex items-center justify-center gap-3"
            onClick={onViewItem}
          >
            <Eye className="w-5 h-5" strokeWidth={1.5} />
            View Item
          </Button>

          <Button
            variant="outlined"
            size="large"
            className="w-full flex items-center justify-center gap-3"
            onClick={onBoostItem}
          >
            <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
            Boost Item
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