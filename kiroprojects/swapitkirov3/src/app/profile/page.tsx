'use client'

import React, { useState } from 'react'
import { 
  Camera, 
  Calendar, 
  MapPin, 
  Star, 
  Edit 
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ItemCard } from '@/components/ui/ItemCard'

// Mock data - in a real app, this would come from your API/database
const mockUser = {
  name: 'John Doe',
  initials: 'JD',
  bio: 'Eco-conscious swapper. Love giving items a second life!',
  joinDate: '19 Dec 2024',
  location: 'Rorschach, Sankt Gallen',
  stats: {
    swaps: 24,
    items: 4,
    rating: 4.5
  }
}

const mockItems = [
  {
    id: '1',
    title: 'iPhone',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/169/220',
    isFree: false
  },
  {
    id: '2',
    title: 'Office Bag',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/169/220',
    isFree: true
  },
  {
    id: '3',
    title: 'Wooden table with stool',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/169/220',
    isFree: false
  },
  {
    id: '4',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/169/220',
    isFree: false
  }
]

const mockSavedItems = [
  {
    id: '5',
    title: 'Vintage Camera',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/169/220',
    isFree: false
  },
  {
    id: '6',
    title: 'Books Collection',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/169/220',
    isFree: true
  },
  {
    id: '7',
    title: 'Gaming Chair',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/169/220',
    isFree: false
  }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'my-items' | 'saved-items'>('my-items')

  const currentItems = activeTab === 'my-items' ? mockItems : mockSavedItems

  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-6 lg:px-[165px] py-6">
        {/* Profile Info Card */}
        <div 
          className="w-full lg:w-[354px] p-4 rounded-2xl border"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          {/* Profile Picture */}
          <div className="relative w-20 h-20 mb-3">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-h6 font-bold"
              style={{ 
                backgroundColor: '#D8F7D7',
                color: '#119C21'
              }}
            >
              {mockUser.initials}
            </div>
            <button 
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2"
              style={{ 
                backgroundColor: '#119C21',
                borderColor: 'var(--bg-primary)'
              }}
            >
              <Camera className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-3">
            <h1 
              className="text-h5 font-bold mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {mockUser.name}
            </h1>
            <p 
              className="text-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              {mockUser.bio}
            </p>
          </div>

          {/* Additional Info */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2">
              <Calendar 
                className="w-4 h-4" 
                style={{ color: 'var(--text-secondary)' }}
                strokeWidth={1.5}
              />
              <span 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Joined at {mockUser.joinDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin 
                className="w-4 h-4" 
                style={{ color: 'var(--text-secondary)' }}
                strokeWidth={1.5}
              />
              <span 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                {mockUser.location}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <div 
                className="text-h6 font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {mockUser.stats.swaps}
              </div>
              <div 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Swaps
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-h6 font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {mockUser.stats.items}
              </div>
              <div 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Items
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span 
                  className="text-h6 font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {mockUser.stats.rating}
                </span>
                <Star 
                  className="w-4 h-4 fill-current" 
                  style={{ color: '#E1B517' }}
                  strokeWidth={1.5}
                />
              </div>
              <div 
                className="text-body-small"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ratings
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button 
            variant="outlined" 
            size="default" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" strokeWidth={1.5} />
            Edit Profile
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Tabs */}
          <div 
            className="flex border-b mb-6"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <button
              onClick={() => setActiveTab('my-items')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'my-items' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'my-items' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'my-items' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'my-items' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                My Items
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'my-items' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  10
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('saved-items')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === 'saved-items' 
                  ? 'border-primary' 
                  : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === 'saved-items' ? '#119C21' : 'transparent'
              }}
            >
              <span 
                className={`text-body-small font-${activeTab === 'saved-items' ? 'bold' : 'medium'}`}
                style={{ 
                  color: activeTab === 'saved-items' ? '#119C21' : 'var(--text-secondary)' 
                }}
              >
                Saved Items
              </span>
              <div 
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeTab === 'saved-items' ? '#119C21' : 'var(--text-secondary)'
                }}
              >
                <span className="text-xs font-medium text-white">
                  3
                </span>
              </div>
            </button>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pb-6">
            {currentItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}