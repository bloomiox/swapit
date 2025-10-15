'use client'

import * as React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ItemCard } from '@/components/ui/ItemCard'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Star, 
  MessageCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

// Mock user data
const mockUser = {
  id: '1',
  name: 'Sarah Miller',
  avatar: '/placeholder.jpg',
  joinedAt: 'Joined at 19 Dec 2024',
  location: 'Rorschach, Sankt Gallen',
  stats: {
    swaps: 24,
    items: 4,
    rating: 4.5
  }
}

// Mock user items
const userItems = [
  {
    id: '1',
    title: 'iPhone',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '2',
    title: 'Office Bag',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: true
  },
  {
    id: '3',
    title: 'Wooden table with stool',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '4',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '5',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '6',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '7',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '8',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/placeholder.jpg',
    isFree: false
  }
]

export default function UserDetailsPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      
      {/* Header with Back Button */}
      <div className="px-4 md:px-6 lg:px-[165px] py-6">
        <Link 
          href="/browse"
          className="inline-flex items-center gap-2 text-body-small-bold hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-primary)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Browse
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-[165px] pb-12">
        <div className="flex gap-6">
          {/* Left Column - User Info */}
          <div className="w-[354px] flex-shrink-0">
            <div 
              className="p-4 rounded-2xl border"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              {/* Profile Picture */}
              <div className="flex justify-center mb-3">
                <div 
                  className="w-20 h-20 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: '#f0f0f0' }}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="text-center mb-3">
                <h1 
                  className="text-h5 font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {mockUser.name}
                </h1>
              </div>

              {/* User Info */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {mockUser.joinedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {mockUser.location}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-stretch gap-4 mb-4">
                <div className="flex-1 text-center">
                  <div 
                    className="text-h6 font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {mockUser.stats.swaps}
                  </div>
                  <div 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Swaps
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div 
                    className="text-h6 font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {mockUser.stats.items}
                  </div>
                  <div 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Items
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span 
                      className="text-h6 font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {mockUser.stats.rating}
                    </span>
                    <Star className="w-4 h-4 fill-current" style={{ color: '#E1B517' }} />
                  </div>
                  <div 
                    className="text-body-small-regular"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Ratings
                  </div>
                </div>
              </div>

              {/* Message Button */}
              <Link href="/chat">
                <Button
                  variant="outlined"
                  size="default"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                  Message
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Items */}
          <div className="flex-1">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-6">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  {/* Shop icon placeholder */}
                  <div className="w-8 h-8 rounded bg-primary"></div>
                </div>
                <h2 
                  className="text-h5 font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Items
                </h2>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                <ArrowRight className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {userItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}