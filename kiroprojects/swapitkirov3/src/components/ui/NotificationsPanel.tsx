'use client'

import React, { useEffect, useRef } from 'react'
import { X, RotateCcw, Gift, MessageCircle, Info, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotifications, useNotificationActions, getNotificationColor } from '@/hooks/useNotifications'

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function NotificationsPanel({ 
  isOpen, 
  onClose, 
  className = '' 
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Data hooks
  const { notifications, unreadCount, loading } = useNotifications()
  const { markAsRead, markAllAsRead } = useNotificationActions()

  // Show only recent notifications in panel (last 3)
  const recentNotifications = notifications.slice(0, 3)

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

  const getNotificationIcon = (type: any) => {
    switch (type) {
      case 'swap_request':
        return <RotateCcw className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      case 'swap_accepted':
        return <Check className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      case 'swap_declined':
        return <RotateCcw className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      case 'swap_completed':
        return <Gift className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      case 'message':
        return <MessageCircle className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      case 'review':
        return <Info className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      case 'item_liked':
        return <Gift className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      case 'system':
        return <Info className="w-5 h-5" style={{ color: getNotificationColor(type) }} />
      default:
        return <Info className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
    }
  }

  const handleNotificationClick = async (notification: any) => {
    try {
      // Mark notification as read if it's unread
      if (!notification.is_read) {
        await markAsRead(notification.id)
      }
      
      // Close the panel first
      onClose()
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'swap_request':
        case 'swap_accepted':
        case 'swap_declined':
        case 'swap_completed':
          router.push('/requests')
          break
        case 'message':
          router.push('/chat')
          break
        case 'review':
        case 'item_liked':
          router.push('/profile')
          break
        case 'system':
          router.push('/notifications')
          break
        default:
          router.push('/notifications')
          break
      }
    } catch (error) {
      console.error('Error handling notification click:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours}h ago`
    } else {
      return date.toLocaleDateString()
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
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-body-small hover:opacity-70 transition-opacity mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Mark all as read ({unreadCount})
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
          {loading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentNotifications.length > 0 ? (
            <div className="space-y-2">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border cursor-pointer hover:shadow-sm transition-all duration-200 ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  style={{
                    backgroundColor: !notification.is_read ? '#F0F9FF' : 'var(--bg-card)',
                    borderColor: !notification.is_read ? '#3B82F6' : 'var(--border-color)'
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-body-small font-medium mb-1 truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {notification.title}
                    </p>
                    <p 
                      className="text-caption truncate mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {notification.message}
                    </p>
                    <p 
                      className="text-caption"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {formatTimestamp(notification.created_at)}
                    </p>
                  </div>

                  {/* New Badge */}
                  {!notification.is_read && (
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#3B82F6' }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p 
                className="text-body-normal"
                style={{ color: 'var(--text-secondary)' }}
              >
                No notifications yet
              </p>
            </div>
          )}

          {/* See All Notifications Button */}
          {notifications.length > 0 && (
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
                See all notifications ({notifications.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}