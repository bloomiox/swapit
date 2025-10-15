'use client'

import * as React from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/Button'
import { useConversations, useMessages, useChatActions, useOnlinePresence } from '@/hooks/useChat'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ArrowLeft, 
  Send,
  MoreVertical,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'



export default function ChatPage() {
  const searchParams = useSearchParams()
  const conversationFromUrl = searchParams.get('conversation')
  
  const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(conversationFromUrl)
  const [messageText, setMessageText] = React.useState('')
  const [sending, setSending] = React.useState(false)

  // Data hooks
  const { user: currentUser } = useAuth()
  const { conversations, loading: conversationsLoading, refetch: refetchConversations } = useConversations()
  const { messages, loading: messagesLoading, refetch: refetchMessages } = useMessages(selectedConversationId)
  const { sendMessage, markMessagesAsRead } = useChatActions()
  const { isUserOnline } = useOnlinePresence()

  // Handle conversation selection from URL or auto-select first conversation
  React.useEffect(() => {
    if (conversationFromUrl) {
      setSelectedConversationId(conversationFromUrl)
    } else if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id)
    }
  }, [conversations, selectedConversationId, conversationFromUrl])

  // Mark messages as read when conversation is selected
  React.useEffect(() => {
    if (selectedConversationId && currentUser) {
      markMessagesAsRead(selectedConversationId).catch(console.error)
    }
  }, [selectedConversationId, currentUser, markMessagesAsRead])

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId)

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId || sending) return

    console.log('Attempting to send message:', {
      conversationId: selectedConversationId,
      messageText: messageText.trim(),
      currentUser: currentUser?.id
    })

    try {
      setSending(true)
      await sendMessage(selectedConversationId, messageText.trim())
      setMessageText('')
      console.log('Message sent successfully')
      
      // Refresh messages and conversations without page reload
      setTimeout(() => {
        refetchMessages()
        refetchConversations()
      }, 500)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Helper functions
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.created_at)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateKey: string
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday'
      } else {
        dateKey = date.toLocaleDateString()
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
      
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-[165px] py-6">
        <div className="flex items-center justify-between">
          <h1 
            className="text-h3 font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Chat ({conversations.length})
          </h1>
          <button
            onClick={() => {
              refetchConversations()
              refetchMessages()
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Refresh conversations"
          >
            <RefreshCw className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-[165px] pb-12">
        <div className="flex gap-6">
          {/* Left Column - Chat List */}
          <div className="w-[390px] flex-shrink-0">
            {conversationsLoading ? (
              <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conversation) => {
                  const isSelected = conversation.id === selectedConversationId
                  const otherUser = conversation.other_participant
                  const isOnline = otherUser?.id ? isUserOnline(otherUser.id) : false

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`flex items-center gap-4 p-3 rounded-2xl border cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-primary-dark' 
                          : 'border-border-color hover:border-primary/50'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                        borderColor: isSelected ? 'var(--primary-dark)' : 'var(--border-color)'
                      }}
                    >
                      {/* Avatar */}
                      <div className="relative w-10 h-10 flex-shrink-0">
                        {otherUser?.avatar_url ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={otherUser.avatar_url}
                              alt={otherUser.full_name || 'User'}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ 
                              backgroundColor: '#D8F7D7',
                              color: '#119C21'
                            }}
                          >
                            {getInitials(otherUser?.full_name || null)}
                          </div>
                        )}
                        {/* Online indicator */}
                        {isOnline && (
                          <div 
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                            style={{ 
                              backgroundColor: 'var(--success-main)',
                              borderColor: 'var(--bg-card)'
                            }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Name and Time */}
                        <div className="flex items-center justify-between mb-1">
                          <h3 
                            className="text-body-normal-medium font-medium truncate"
                            style={{ color: isSelected ? 'var(--primary-dark)' : 'var(--text-primary)' }}
                          >
                            {otherUser?.full_name || 'Anonymous User'}
                          </h3>
                          <span 
                            className="text-caption-regular flex-shrink-0"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {conversation.last_message_at ? formatTime(conversation.last_message_at) : ''}
                          </span>
                        </div>

                        {/* Message and Badge */}
                        <div className="flex items-center justify-between">
                          <p 
                            className="text-body-small-regular truncate flex-1"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {conversation.last_message?.content || 'No messages yet'}
                          </p>
                          {(conversation.unread_count || 0) > 0 && (
                            <div 
                              className="w-4 h-4 rounded-full flex items-center justify-center ml-2 flex-shrink-0"
                              style={{ backgroundColor: '#FDE1E0' }}
                            >
                              <span 
                                className="text-xs font-semibold"
                                style={{ color: '#7C0D09', fontSize: '8px' }}
                              >
                                {conversation.unread_count}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
                  No conversations yet. Start chatting with other users!
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Active Chat */}
          <div className="flex-1">
            <div 
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              {/* Chat Header */}
              {selectedConversation ? (
                <div 
                  className="flex items-center gap-3 p-3 border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {/* Avatar */}
                  <div className="relative">
                    {selectedConversation.other_participant?.avatar_url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={selectedConversation.other_participant.avatar_url}
                          alt={selectedConversation.other_participant.full_name || 'User'}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ 
                          backgroundColor: '#D8F7D7',
                          color: '#119C21'
                        }}
                      >
                        {getInitials(selectedConversation.other_participant?.full_name || null)}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 
                      className="text-body-small-bold font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {selectedConversation.other_participant?.full_name || 'Anonymous User'}
                    </h3>
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: selectedConversation.other_participant?.id && isUserOnline(selectedConversation.other_participant.id) 
                            ? 'var(--success-main)' 
                            : 'var(--text-secondary)' 
                        }}
                      />
                      <span 
                        className="text-caption-regular"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {selectedConversation.other_participant?.id && isUserOnline(selectedConversation.other_participant.id) ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="flex items-center justify-center p-3 border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Select a conversation</span>
                </div>
              )}

              {/* Messages */}
              <div className="p-2 max-h-[500px] overflow-y-auto">
                {messagesLoading ? (
                  <div className="space-y-4 p-2">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className="max-w-xs p-2 rounded-xl bg-gray-200 animate-pulse">
                          <div className="h-4 bg-gray-300 rounded mb-1"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4 p-2">
                    {Object.entries(groupMessagesByDate(messages)).map(([dateKey, dateMessages]) => (
                      <div key={dateKey}>
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
                            {dateKey}
                          </div>
                          <div 
                            className="flex-1 h-px"
                            style={{ backgroundColor: 'var(--border-color)' }}
                          />
                        </div>

                        {/* Messages for this date */}
                        <div className="space-y-1">
                          {dateMessages.map((message, index) => {
                            const isMyMessage = message.sender_id === currentUser?.id
                            const prevMessage = index > 0 ? dateMessages[index - 1] : null
                            const isConsecutive = prevMessage && prevMessage.sender_id === message.sender_id

                            return (
                              <div 
                                key={message.id} 
                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
                              >
                                <div 
                                  className="max-w-xs p-2 rounded-xl"
                                  style={{ 
                                    backgroundColor: isMyMessage ? 'var(--primary)' : 'var(--bg-secondary)'
                                  }}
                                >
                                  <p 
                                    className="text-body-small-regular"
                                    style={{ 
                                      color: isMyMessage ? 'var(--general-white)' : 'var(--text-primary)'
                                    }}
                                  >
                                    {message.content}
                                  </p>
                                  <div className="flex justify-center mt-1">
                                    <span 
                                      className="text-caption-regular"
                                      style={{ 
                                        color: isMyMessage ? 'var(--general-white)' : 'var(--text-secondary)'
                                      }}
                                    >
                                      {formatMessageTime(message.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedConversation ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
                      Select a conversation to start chatting
                    </p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              {selectedConversation && (
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
                      disabled={sending}
                      className="w-full px-4 py-3 border rounded-2xl outline-none text-body-normal disabled:opacity-50"
                      style={{ 
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <Send className="w-5 h-5" style={{ color: 'var(--general-white)' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      </main>
    </ProtectedRoute>
  )
}