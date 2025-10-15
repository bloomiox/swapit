'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Gift, MessageCircle, Info } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

interface Notification {
  id: string
  message: string
  timestamp: string
  isNew: boolean
  type: 'swap_request' | 'claim_request' | 'message' | 'system'
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
  },
  {
    id: '7',
    message: 'You have a new message from Mike Johnson',
    timestamp: '18 Dec 2024 at 3:30 PM',
    isNew: false,
    type: 'message'
  },
  {
    id: '8',
    message: 'Your item "Vintage Camera" has been boosted successfully',
    timestamp: '18 Dec 2024 at 1:15 PM',
    isNew: false,
    type: 'system'
  }
]

export default function NotificationsPage() {
  const router = useRouter()

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
        // System notifications might stay on the same page or go to profile
        // For now, we'll keep them on the notifications page
        console.log('System notification clicked - staying on notifications page')
        break
      default:
        console.log('Unknown notification type')
        break
    }
  }

  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-h3 font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Notifications
            </h1>
            <p 
              className="text-body-normal mt-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Stay updated with your swap requests and messages
            </p>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer hover:shadow-sm transition-all duration-200"
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
                    className="px-3 py-1 rounded-full"
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

          {/* Empty State (if no notifications) */}
          {mockNotifications.length === 0 && (
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
  )
}