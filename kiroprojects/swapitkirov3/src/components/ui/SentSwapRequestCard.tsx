'use client'

import React from 'react'
import { 
  MessageCircle, 
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SentSwapRequestCardProps {
  request: {
    id: string
    user: {
      name: string
      avatar: string
      timestamp: string
    }
    wantedItem: {
      title: string
      image: string
    }
    offeredItem: {
      title: string
      image: string
    }
    message: string
    status: 'pending' | 'accepted' | 'rejected'
  }
  onMessage: (requestId: string) => void
}

export function SentSwapRequestCard({ 
  request, 
  onMessage 
}: SentSwapRequestCardProps) {
  return (
    <div
      className="p-4 rounded-2xl border"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={request.user.avatar}
          alt={request.user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 
            className="text-body-normal font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {request.user.name}
          </h3>
          <p 
            className="text-body-small"
            style={{ color: 'var(--text-secondary)' }}
          >
            {request.user.timestamp}
          </p>
        </div>
      </div>

      {/* Swap Items */}
      <div 
        className="relative p-4 rounded-2xl border mb-4"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex">
          {/* Wanted Item */}
          <div className="flex-1">
            <div className="flex gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-[92px] h-[92px] rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={request.wantedItem.image}
                  alt={request.wantedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p 
                  className="text-caption mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  You Want
                </p>
                <h4 
                  className="text-body-small font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {request.wantedItem.title}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Offered Item */}
        <div className="flex pt-4">
          <div className="flex-1">
            <div className="flex gap-3">
              <div className="w-[92px] h-[92px] rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={request.offeredItem.image}
                  alt={request.offeredItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p 
                  className="text-caption mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  You Offering
                </p>
                <h4 
                  className="text-body-small font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {request.offeredItem.title}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Icon */}
        <div 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#D8F7D7' }}
        >
          <RotateCcw 
            className="w-5 h-5" 
            style={{ color: '#416B40' }}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Message */}
      <div 
        className="p-3 rounded-2xl mb-4"
        style={{ backgroundColor: '#F9F9F9' }}
      >
        <p 
          className="text-caption-medium mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Message
        </p>
        <p 
          className="text-body-small"
          style={{ color: 'var(--text-primary)' }}
        >
          {request.message}
        </p>
      </div>

      {/* Action Buttons - Only Message button for sent requests */}
      <div className="flex gap-2">
        <Button
          variant="outlined"
          size="default"
          className="flex items-center gap-2"
          onClick={() => onMessage(request.id)}
        >
          <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          Message
        </Button>
      </div>
    </div>
  )
}