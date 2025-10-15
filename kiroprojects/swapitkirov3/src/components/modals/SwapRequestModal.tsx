'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface UserItem {
  id: string
  title: string
  image: string
  isFree: boolean
}

interface SwapRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSendRequest: (selectedItems: string[], message: string) => void
  userItems?: UserItem[]
}

// Mock user items - in a real app, this would come from props or API
const mockUserItems: UserItem[] = [
  {
    id: '1',
    title: 'Stool',
    image: '/placeholder.jpg',
    isFree: true
  },
  {
    id: '2',
    title: 'Designer Handbag',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '3',
    title: 'Stool',
    image: '/placeholder.jpg',
    isFree: false
  }
]

export function SwapRequestModal({ 
  isOpen, 
  onClose, 
  onSendRequest,
  userItems = mockUserItems
}: SwapRequestModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')

  const filteredItems = userItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSendRequest = () => {
    if (selectedItems.length > 0) {
      onSendRequest(selectedItems, message)
      // Reset form
      setSelectedItems([])
      setMessage('')
      setSearchQuery('')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 
            className="text-h6 font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Select items to offer
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Search Bar */}
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

        {/* Items Grid */}
        <div className="px-4 pb-4">
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
                  borderColor: selectedItems.includes(item.id) ? 'var(--primary)' : 'var(--border-color)'
                }}
              >
                {/* Image Container */}
                <div className="p-1">
                  <div className="relative aspect-[167/220] rounded-xl overflow-hidden">
                    <div 
                      className="w-full h-full bg-gray-200 flex items-center justify-center"
                      style={{ backgroundColor: '#f0f0f0' }}
                    >
                      <span className="text-gray-500 text-xs">Image</span>
                    </div>
                    
                    {/* Free Badge */}
                    {item.isFree && (
                      <div 
                        className="absolute top-1 right-1 px-2 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <span 
                          className="text-caption-medium"
                          style={{ color: 'var(--general-white)' }}
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
                    className="text-body-small-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="px-4 pb-4">
          <div className="space-y-2">
            <label 
              className="text-body-normal-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Message (optional)
            </label>
            <textarea
              placeholder="Anything you'd like to say..."
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
            disabled={selectedItems.length === 0}
          >
            Send Swap Request
          </Button>
        </div>
      </div>
    </Modal>
  )
}