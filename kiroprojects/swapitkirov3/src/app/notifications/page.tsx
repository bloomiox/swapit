'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Gift, MessageCircle, Info, Check, Trash2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/Button'
import { useNotifications, useNotificationActions, getNotificationIcon, getNotificationColor } from '@/hooks/useNotifications'

export default function NotificationsPage() {
  const router = useRouter()
  const { notifications, unreadCount, loading, error } = useNotifications()
  const { markAsRead, markAllAsRead, deleteNotification } = useNotificationActions()

  const handleNotificationClick = async (notification: any) => {
    try {
      // Mark notification as read if it's unread
      if (!notification.is_read) {
        await markAsRead(notification.id)
      }
      
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
          router.push('/profile')
          break
        case 'item_liked':
          router.push('/profile')
          break
        case 'system':
          // System notifications stay on the same page
          break
        default:
          console.log('Unknown notification type')
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

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await deleteNotification(notificationId)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const getNotificationIconComponent = (type: any) => {
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

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-2.5">
        <Navbar />
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 
                  className="text-h3 font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Notifications ({notifications.length})
                </h1>
                <p 
                  className="text-body-normal mt-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {unreadCount > 0 
                    ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                    : 'All caught up!'
                  }
                </p>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="outlined"
                  size="default"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-body-large mb-4" style={{ color: 'var(--text-secondary)' }}>
                Unable to load notifications. Please try again.
              </p>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer hover:shadow-sm transition-all duration-200 ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  style={{
                    backgroundColor: !notification.is_read ? '#F0F9FF' : 'var(--bg-card)',
                    borderColor: !notification.is_read ? '#3B82F6' : 'var(--border-color)'
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIconComponent(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 
                      className="text-body-normal font-medium mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {notification.title}
                    </h3>
                    <p 
                      className="text-body-small mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {notification.message}
                    </p>
                    <p 
                      className="text-body-small"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {formatTimestamp(notification.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Unread Badge */}
                    {!notification.is_read && (
                      <div 
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#3B82F6' }}
                      >
                        <span className="text-caption-medium text-white">
                          New
                        </span>
                      </div>
                    )}
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--border-color)' }}
                >
                  <span className="text-2xl">🔔</span>
                </div>
              </div>
              <h3 
                className="text-h6 font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                No notifications yet
              </h3>
              <p 
                className="text-body-normal"
                style={{ color: 'var(--text-secondary)' }}
              >
                When you receive swap requests or messages, they'll appear here
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      </main>
    </ProtectedRoute>
  )
}