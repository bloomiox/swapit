'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  MessageCircle, 
  Gift
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SwapRequest } from '@/hooks/useSwapRequests'

interface DropzoneRequestCardProps {
  request: SwapRequest
  onMessage: (requestId: string) => void
}

export function DropzoneRequestCard({ 
  request, 
  onMessage 
}: DropzoneRequestCardProps) {
  const router = useRouter()

  const handleItemClick = (itemId: string) => {
    router.push(`/item/${itemId}`)
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#119C21'
      case 'rejected':
        return '#FD5F59'
      case 'completed':
        return '#119C21'
      case 'cancelled':
        return '#6B7280'
      default:
        return '#E1B517'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Rejected'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Pending'
    }
  }

  return (
    <div
      className="p-4 rounded-2xl border"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* User Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {request.owner.avatar_url ? (
            <img
              src={request.owner.avatar_url}
              alt={request.owner.full_name || 'User'}
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
              {(request.owner.full_name || 'U')[0].toUpperCase()}
            </div>
          )}
          <div>
            <h3 
              className="text-body-normal font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {request.owner.full_name || 'Anonymous User'}
            </h3>
            <p 
              className="text-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              {formatDate(request.created_at)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div 
          className="px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: `${getStatusColor(request.status)}20`,
            color: getStatusColor(request.status)
          }}
        >
          <span className="text-caption-medium font-medium">
            {getStatusText(request.status)}
          </span>
        </div>
      </div>

      {/* Free Item */}
      <div 
        className="relative p-4 rounded-2xl border mb-4"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex gap-3">
          <div 
            className="w-[92px] h-[92px] rounded-xl overflow-hidden bg-gray-200 relative cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleItemClick(request.requested_item.id)}
          >
            {request.requested_item.images && request.requested_item.images.length > 0 ? (
              <img
                src={request.requested_item.images[0]}
                alt={request.requested_item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">No Image</span>
              </div>
            )}
            
            {/* Free Badge */}
            <div 
              className="absolute top-1 right-1 px-2 py-1 rounded-full"
              style={{ backgroundColor: '#119C21' }}
            >
              <span 
                className="text-xs font-medium text-white"
              >
                FREE
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <p 
              className="text-caption mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              You Requested
            </p>
            <h4 
              className="text-body-small font-bold mb-2 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => handleItemClick(request.requested_item.id)}
            >
              {request.requested_item.title}
            </h4>
          </div>
        </div>

        {/* Free Icon */}
        <div 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#D8F7D7' }}
        >
          <Gift 
            className="w-5 h-5" 
            style={{ color: '#416B40' }}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Message */}
      {request.message && (
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
      )}

      {/* Action Buttons */}
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