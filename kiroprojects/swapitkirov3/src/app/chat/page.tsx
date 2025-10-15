'use client'

import * as React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Send
} from 'lucide-react'
import Link from 'next/link'

// Mock chat data
const mockChats = [
  {
    id: '1',
    name: 'Sarah Miller',
    avatar: '/placeholder.jpg',
    lastMessage: 'Latest message will appear here and will truncate on the first line as well',
    time: '12:17 PM',
    unreadCount: 2,
    isSelected: true,
    isOnline: true
  },
  {
    id: '2',
    name: 'Joshua',
    avatar: '/placeholder.jpg',
    lastMessage: 'Latest message will appear here and will truncate on the first line as well',
    time: '24 Dec',
    unreadCount: 0,
    isSelected: false,
    isOnline: false
  },
  {
    id: '3',
    name: 'Armin',
    avatar: '/placeholder.jpg',
    lastMessage: 'Latest message will appear here and will truncate on the first line as well',
    time: '24 Dec',
    unreadCount: 0,
    isSelected: false,
    isOnline: false
  },
  {
    id: '4',
    name: 'Natasha',
    avatar: '/placeholder.jpg',
    lastMessage: 'Latest message will appear here and will truncate on the first line as well',
    time: '24 Dec',
    unreadCount: 0,
    isSelected: false,
    isOnline: false
  },
  {
    id: '5',
    name: 'John',
    avatar: '/placeholder.jpg',
    lastMessage: 'Latest message will appear here and will truncate on the first line as well',
    time: '24 Dec',
    unreadCount: 0,
    isSelected: false,
    isOnline: false
  }
]

// Mock messages for the active chat
const mockMessages = [
  {
    id: '1',
    text: 'This is how a message will look from other person',
    time: '12:04 PM',
    isMe: false,
    isConsecutive: false
  },
  {
    id: '2',
    text: 'The bubble will have certain length',
    time: '12:04 PM',
    isMe: false,
    isConsecutive: true
  },
  {
    id: '3',
    text: 'This is how a message will look from myself',
    time: '12:04 PM',
    isMe: true,
    isConsecutive: false
  },
  {
    id: '4',
    text: 'Messages will be separated by date. Today and Yesterday will be used and then the date will be shown afterwards',
    time: '12:04 PM',
    isMe: true,
    isConsecutive: false
  },
  {
    id: '5',
    text: 'Sure, Alright',
    time: '12:04 PM',
    isMe: false,
    isConsecutive: false
  },
  {
    id: '6',
    text: 'Oh! and consecutive messages from the same user will have less spacing as compared to other person message',
    time: '12:04 PM',
    isMe: false,
    isConsecutive: true
  },
  {
    id: '7',
    text: 'Cool! Let\'s see how this project goes. Maybe in the future, we can have more like this.',
    time: '12:04 PM',
    isMe: true,
    isConsecutive: false
  }
]

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = React.useState('1')
  const [messageText, setMessageText] = React.useState('')
  
  const selectedChat = mockChats.find(chat => chat.id === selectedChatId)

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message via API
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-[165px] py-6">
        <h1 
          className="text-h3 font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Chat ({mockChats.length})
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-[165px] pb-12">
        <div className="flex gap-6">
          {/* Left Column - Chat List */}
          <div className="w-[390px] flex-shrink-0">
            <div className="space-y-2">
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border cursor-pointer transition-colors ${
                    chat.isSelected 
                      ? 'border-primary-dark' 
                      : 'border-border-color hover:border-primary/50'
                  }`}
                  style={{ 
                    backgroundColor: chat.isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                    borderColor: chat.isSelected ? 'var(--primary-dark)' : 'var(--border-color)'
                  }}
                >
                  {/* Avatar */}
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-full h-full object-cover"
                      style={{ backgroundColor: '#f0f0f0' }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name and Time */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 
                        className="text-body-normal-medium font-medium truncate"
                        style={{ color: chat.isSelected ? 'var(--primary-dark)' : 'var(--text-primary)' }}
                      >
                        {chat.name}
                      </h3>
                      <span 
                        className="text-caption-regular flex-shrink-0"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {chat.time}
                      </span>
                    </div>

                    {/* Message and Badge */}
                    <div className="flex items-center justify-between">
                      <p 
                        className="text-body-small-regular truncate flex-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center ml-2 flex-shrink-0"
                          style={{ backgroundColor: '#FDE1E0' }}
                        >
                          <span 
                            className="text-xs font-semibold"
                            style={{ color: '#7C0D09', fontSize: '8px' }}
                          >
                            {chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Active Chat */}
          <div className="flex-1">
            <div 
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              {/* Chat Header */}
              <div 
                className="flex items-center gap-3 p-3 border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                {/* Avatar */}
                <div 
                  className="w-10 h-10 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <img
                    src={selectedChat?.avatar}
                    alt={selectedChat?.name}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: '#f0f0f0' }}
                  />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h3 
                    className="text-body-small-bold font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {selectedChat?.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedChat?.isOnline ? 'var(--success-main)' : 'var(--text-secondary)' }}
                    />
                    <span 
                      className="text-caption-regular"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {selectedChat?.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-2 max-h-[500px] overflow-y-auto">
                {/* Yesterday Messages */}
                <div className="space-y-4 p-2">
                  <div className="space-y-1">
                    <div className="flex">
                      <div 
                        className="max-w-xs p-2 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <p 
                          className="text-body-small-regular"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          This is how a message will look from other person
                        </p>
                        <div className="flex justify-center mt-1">
                          <span 
                            className="text-caption-regular"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            12:04 PM
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div 
                        className="max-w-xs p-2 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <p 
                          className="text-body-small-regular"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          The bubble will have certain length
                        </p>
                        <div className="flex justify-center mt-1">
                          <span 
                            className="text-caption-regular"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            12:04 PM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div 
                      className="max-w-xs p-2 rounded-xl"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <p 
                        className="text-body-small-regular"
                        style={{ color: 'var(--general-white)' }}
                      >
                        This is how a message will look from myself
                      </p>
                      <div className="flex justify-center mt-1">
                        <span 
                          className="text-caption-regular"
                          style={{ color: 'var(--general-white)' }}
                        >
                          12:04 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Separator */}
                <div className="flex items-center gap-4 py-2">
                  <div 
                    className="flex-1 h-px"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  />
                  <div 
                    className="px-2 py-1 rounded-full border text-caption-medium"
                    style={{ 
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Today
                  </div>
                  <div 
                    className="flex-1 h-px"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  />
                </div>

                {/* Today Messages */}
                <div className="space-y-4 p-2">
                  <div className="flex justify-end">
                    <div 
                      className="max-w-xs p-2 rounded-xl"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <p 
                        className="text-body-small-regular"
                        style={{ color: 'var(--general-white)' }}
                      >
                        Messages will be separated by date. Today and Yesterday will be used and then the date will be shown afterwards
                      </p>
                      <div className="flex justify-center mt-1">
                        <span 
                          className="text-caption-regular"
                          style={{ color: 'var(--general-white)' }}
                        >
                          12:04 PM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex">
                      <div 
                        className="max-w-xs p-2 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <p 
                          className="text-body-small-regular"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Sure, Alright
                        </p>
                        <div className="flex justify-center mt-1">
                          <span 
                            className="text-caption-regular"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            12:04 PM
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div 
                        className="max-w-xs p-2 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <p 
                          className="text-body-small-regular"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Oh! and consecutive messages from the same user will have less spacing as compared to other person message
                        </p>
                        <div className="flex justify-center mt-1">
                          <span 
                            className="text-caption-regular"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            12:04 PM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div 
                      className="max-w-xs p-2 rounded-xl"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      <p 
                        className="text-body-small-regular"
                        style={{ color: 'var(--general-white)' }}
                      >
                        Cool! Let's see how this project goes. Maybe in the future, we can have more like this.
                      </p>
                      <div className="flex justify-center mt-1">
                        <span 
                          className="text-caption-regular"
                          style={{ color: 'var(--general-white)' }}
                        >
                          12:04 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div 
                className="flex items-center gap-2 p-4 border-t"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Type a message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border rounded-2xl outline-none text-body-normal"
                    style={{ 
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Send className="w-5 h-5" style={{ color: 'var(--general-white)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}