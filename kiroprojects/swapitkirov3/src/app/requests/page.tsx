'use client'

import React, { useState } from 'react'
import { 
  RotateCcw
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SwapRequestCard } from '@/components/ui/SwapRequestCard'
import { SentSwapRequestCard } from '@/components/ui/SentSwapRequestCard'

interface SwapRequest {
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

// Mock data for received requests
const mockReceivedRequests: SwapRequest[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Miller',
      avatar: '/api/placeholder/40/40',
      timestamp: '19 Dec 2024 at 12:00 PM'
    },
    wantedItem: {
      title: 'Vintage Stool',
      image: '/api/placeholder/92/92'
    },
    offeredItem: {
      title: 'Leather bag with original strap and long 3 pockets',
      image: '/api/placeholder/92/92'
    },
    message: 'Hi! I love your vintage stool. Would you be interested in swapping for my leather bag?',
    status: 'pending'
  },
  {
    id: '2',
    user: {
      name: 'John Smith',
      avatar: '/api/placeholder/40/40',
      timestamp: '18 Dec 2024 at 3:30 PM'
    },
    wantedItem: {
      title: 'iPhone 13',
      image: '/api/placeholder/92/92'
    },
    offeredItem: {
      title: 'Samsung Galaxy S21',
      image: '/api/placeholder/92/92'
    },
    message: 'Would you like to swap your iPhone for my Samsung? It\'s in excellent condition!',
    status: 'pending'
  },
  {
    id: '3',
    user: {
      name: 'Emma Wilson',
      avatar: '/api/placeholder/40/40',
      timestamp: '17 Dec 2024 at 10:15 AM'
    },
    wantedItem: {
      title: 'Office Chair',
      image: '/api/placeholder/92/92'
    },
    offeredItem: {
      title: 'Standing Desk',
      image: '/api/placeholder/92/92'
    },
    message: 'I have a great standing desk that would be perfect for your office setup. Interested in a swap?',
    status: 'pending'
  }
]

// Mock data for sent requests
const mockSentRequests: SwapRequest[] = [
  {
    id: '4',
    user: {
      name: 'Sarah Miller',
      avatar: '/api/placeholder/40/40',
      timestamp: '19 Dec 2024 at 12:00 PM'
    },
    wantedItem: {
      title: 'Vintage Stool',
      image: '/api/placeholder/92/92'
    },
    offeredItem: {
      title: 'Leather bag with original strap and long 3 pockets',
      image: '/api/placeholder/92/92'
    },
    message: 'Hi! I love your vintage stool. Would you be interested in swapping for my leather bag?',
    status: 'pending'
  },
  {
    id: '5',
    user: {
      name: 'Mike Johnson',
      avatar: '/api/placeholder/40/40',
      timestamp: '18 Dec 2024 at 2:15 PM'
    },
    wantedItem: {
      title: 'Gaming Headset',
      image: '/api/placeholder/92/92'
    },
    offeredItem: {
      title: 'Wireless Keyboard',
      image: '/api/placeholder/92/92'
    },
    message: 'Hey! I saw your gaming headset and would love to trade my wireless keyboard for it. Let me know!',
    status: 'pending'
  },
  {
    id: '6',
    user: {
      name: 'Lisa Chen',
      avatar: '/api/placeholder/40/40',
      timestamp: '17 Dec 2024 at 4:45 PM'
    },
    wantedItem: {
      title: 'Coffee Maker',
      image: '/api/placeholder/92/92'
    },
    offeredItem: {
      title: 'Blender',
      image: '/api/placeholder/92/92'
    },
    message: 'Would you be interested in swapping your coffee maker for my high-speed blender?',
    status: 'pending'
  }
]

type TabType = 'received' | 'sent' | 'dropzone'

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('sent')

  const handleAccept = (requestId: string) => {
    console.log('Accept request:', requestId)
    // Handle accept logic
  }

  const handleReject = (requestId: string) => {
    console.log('Reject request:', requestId)
    // Handle reject logic
  }

  const handleMessage = (requestId: string) => {
    console.log('Message user:', requestId)
    // Handle message logic
  }

  const getTabContent = () => {
    switch (activeTab) {
      case 'received':
        return mockReceivedRequests
      case 'sent':
        return mockSentRequests
      case 'dropzone':
        return [] // Mock dropzone requests
      default:
        return mockReceivedRequests
    }
  }

  const currentRequests = getTabContent()

  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="px-4 md:px-6 lg:px-[165px] py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 
              className="text-h3 font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Swap Requests
            </h1>
          </div>

          {/* Tabs */}
          <div 
            className="flex border-b mb-6"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => setActiveTab('received')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'received' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'received' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'received' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'received' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Received
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'received' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {mockReceivedRequests.length}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'sent' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'sent' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'sent' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'sent' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Sent
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'sent' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  {mockSentRequests.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('dropzone')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'dropzone' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'dropzone' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'dropzone' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'dropzone' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Dropzone
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'dropzone' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  0
                </span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                activeTab === 'sent' ? (
                  <SentSwapRequestCard
                    key={request.id}
                    request={request}
                    onMessage={handleMessage}
                  />
                ) : (
                  <SwapRequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onMessage={handleMessage}
                  />
                )
              ))
            ) : (
              <div className="text-center py-16">
                <div className="mb-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  >
                    <RotateCcw className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </div>
                <h3 
                  className="text-h6 font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  No {activeTab} requests
                </h3>
                <p 
                  className="text-body-normal"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {activeTab === 'received' && 'When others request to swap with your items, they\'ll appear here'}
                  {activeTab === 'sent' && 'Requests you\'ve sent to other users will appear here'}
                  {activeTab === 'dropzone' && 'Free items you\'ve requested will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}