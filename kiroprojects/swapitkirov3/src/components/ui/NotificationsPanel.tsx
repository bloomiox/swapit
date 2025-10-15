'use client'

import React, { useEffect, useRef } from 'react'
import { X, RotateCcw, Gift, MessageCircle, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  message: string
  timestamp: string
  isNew: boolean
  type: 'swap_request' | 'claim_request' | 'message' | 'system'
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Sarah Miller has requested a swap for your Vintage Stool',
    timestamp: '19 Dec 2024 at 12:00 PM',
    isNew: true,
    type: 'swap_request'
  },
  {
    id: '2',
    message: 'Joshua has claimed your Free Office Chair',
    timestamp: '19 Dec 2024 at 11:00 PM',
    isNew: true,
    type: 'claim_request'
  },
  {
    id: '3',
    message: 'Henry Wong has requested a swap for your Vintage Stool',
    timestamp: '19 Dec 2024 at 9:00 PM',
    isNew: false,
    type: 'swap_request'
  },
  {
    id: '4',
    message: 'Ali has requested a swap for your iPhone',
    timestamp: '19 Dec 2024 at 8:40 PM',
    isNew: false,
    type: 'swap_request'
  },
  {
    id: '5',
    message: 'Jane has claimed your Free Desk Lamp',
    timestamp: '19 Dec 2024 at 7:11 PM',
    isNew: false,
    type: 'claim_request'
  },
  {
    id: '6',
    message: 'Jane has requested a swap for your iPhone',
    timestamp: '19 Dec 2024 at 12:00 PM',
    isNew: false,
    type: 'swap_request'
  }
]

export function NotificationsPanel({ 
  isOpen, 
  onClose, 
  className = '' 
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'swap_request':
        return <RotateCcw className="w-5 h-5" style={{ color: '#119C21' }} />
      case 'claim_request':
        return <Gift className="w-5 h-5" style={{ color: '#FD5F59' }} />
      case 'message':
        return <MessageCircle className="w-5 h-5" style={{ color: '#2196F3' }} />
      case 'system':
        return <Info className="w-5 h-5" style={{ color: '#FF9800' }} />
      default:
        return <Info className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    console.log('Notification clicked:', notification)
    
    // Mark notification as read (in a real app, this would be an API call)
    if (notification.isNew) {
      console.log('Marking notification as read:', notification.id)
      // In a real app: markNotificationAsRead(notification.id)
    }
    
    // Close the panel first
    onClose()
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'swap_request':
      case 'claim_request':
        // Both swap requests and claim requests go to the requests page
        router.push('/requests')
        break
      case 'message':
        // Message notifications go to chat
        router.push('/chat')
        break
      case 'system':
        // System notifications might go to a specific page or stay on notifications
        router.push('/notifications')
        break
      default:
        // Default to notifications page
        router.push('/notifications')
        break
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0" style={{ zIndex: 9998 }} />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        className={`absolute right-0 top-full mt-2 w-[90vw] max-w-[600px] rounded-3xl border ${className}`}
        style={{
          zIndex: 9999,
          backgroundColor: 'var(--bg-primary)',
          boxShadow: '0px 16px 40px 0px rgba(23, 34, 99, 0.4)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 
                className="text-h4 font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Notifications
              </h2>
              {mockNotifications.some(n => n.isNew) && (
                <button
                  onClick={() => {
                    console.log('Mark all as read')
                    // In a real app: markAllNotificationsAsRead()
                  }}
                  className="text-body-small hover:opacity-70 transition-opacity mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Mark all as read
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <X 
                className="w-5 h-5" 
                style={{ color: 'var(--text-primary)' }}
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="flex items-center gap-4 p-3 rounded-2xl border cursor-pointer hover:shadow-sm transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p 
                    className="text-body-normal font-medium mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {notification.message}
                  </p>
                  <p 
                    className="text-body-small"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {notification.timestamp}
                  </p>
                </div>

                {/* New Badge */}
                {notification.isNew && (
                  <div 
                    className="px-2 py-1 rounded-full"
                    style={{ backgroundColor: '#FD5F59' }}
                  >
                    <span 
                      className="text-caption-medium text-white"
                    >
                      New
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View All Link */}
          {mockNotifications.length > 0 && (
            <div 
              className="mt-4 pt-4 border-t text-center"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <button
                onClick={() => {
                  onClose()
                  router.push('/notifications')
                }}
                className="text-body-small font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#119C21' }}
              >
                View all notifications
              </button>
            </div>
          )}

          {/* Empty State (if no notifications) */}
          {mockNotifications.length === 0 && (
            <div className="text-center py-8">
              <p 
                className="text-body-normal"
                style={{ color: 'var(--text-secondary)' }}
              >
                No notifications yet
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}