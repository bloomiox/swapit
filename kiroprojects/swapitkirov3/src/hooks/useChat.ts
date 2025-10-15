'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface ChatConversation {
  id: string
  participant1_id: string
  participant2_id: string
  last_message_at: string | null
  created_at: string
  // Joined data
  other_participant?: {
    id: string
    full_name: string | null
    avatar_url: string | null
    is_online?: boolean
  }
  last_message?: {
    id: string
    content: string
    sender_id: string
    created_at: string
  }
  unread_count?: number
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'swap_proposal' | 'system'
  swap_proposal_id?: string | null
  created_at: string
  // Joined data
  sender?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

// Hook for managing conversations
export function useConversations() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch conversations where user is a participant
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false })

      if (conversationsError) throw conversationsError

      // Get other participants' info and last messages
      const conversationsWithDetails = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          const otherParticipantId = conv.participant1_id === user.id 
            ? conv.participant2_id 
            : conv.participant1_id

          // Get other participant info
          const { data: participantData } = await supabase
            .from('users')
            .select('id, full_name, avatar_url')
            .eq('id', otherParticipantId)
            .single()

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('id, content, sender_id, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          // Count unread messages from other participants
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .eq('is_read', false)

          return {
            ...conv,
            other_participant: participantData,
            last_message: lastMessage,
            unread_count: unreadCount || 0
          }
        })
      )

      setConversations(conversationsWithDetails)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Auto-refresh conversations when user is active (only when page is visible)
  useEffect(() => {
    if (!user) return

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchConversations()
      }
    }

    // Refresh when page becomes visible
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Also refresh every 30 seconds if page is visible
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchConversations()
      }
    }, 30000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [user, fetchConversations])

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations
  }
}

// Hook for managing messages in a conversation
export function useMessages(conversationId: string | null) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }, [conversationId, user])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Auto-refresh messages when viewing a conversation (only when page is visible)
  useEffect(() => {
    if (!conversationId) return

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMessages()
      }
    }

    // Refresh when page becomes visible
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Also refresh every 10 seconds if page is visible
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchMessages()
      }
    }, 10000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [conversationId, fetchMessages])

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages
  }
}

// Hook for chat actions
export function useChatActions() {
  const { user } = useAuth()

  const createOrGetConversation = async (otherUserId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated')

    // Check if conversation already exists
    const { data: existingConv, error: searchError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`)
      .single()

    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError
    }

    if (existingConv) {
      return existingConv.id
    }

    // Create new conversation
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({
        participant1_id: user.id,
        participant2_id: otherUserId
      })
      .select('id')
      .single()

    if (createError) throw createError

    return newConv.id
  }

  const sendMessage = async (conversationId: string, content: string, messageType: 'text' | 'swap_proposal' | 'system' = 'text') => {
    if (!user) throw new Error('User not authenticated')

    console.log('Sending message to database:', {
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      message_type: messageType
    })

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: messageType
      })
      .select()

    if (error) {
      console.error('Database error when sending message:', error)
      throw new Error(`Failed to send message: ${error.message}`)
    }

    console.log('Message inserted successfully:', data)

    // Update conversation's last message timestamp
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId)

    if (updateError) {
      console.error('Error updating conversation timestamp:', updateError)
      // Don't throw here as the message was sent successfully
    }
  }

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) throw new Error('User not authenticated')

    // Mark all unread messages in this conversation as read
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .eq('is_read', false)

    if (error) {
      console.error('Error marking messages as read:', error)
      throw error
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', user.id)

    if (error) throw error
  }

  return {
    createOrGetConversation,
    sendMessage,
    markMessagesAsRead,
    deleteMessage
  }
}

// Hook for simple online status (simplified - just shows everyone as offline for now)
export function useOnlinePresence() {
  const isUserOnline = (userId: string) => false // Simplified - no real online presence

  return {
    onlineUsers: [],
    isUserOnline
  }
}

// Hook for unread message count
export function useUnreadMessageCount() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Get all conversations for the user
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)

      if (convError) throw convError

      if (!conversations || conversations.length === 0) {
        setUnreadCount(0)
        setLoading(false)
        return
      }

      // Count unread messages across all conversations
      let totalUnread = 0
      for (const conv of conversations) {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', user.id)
          .eq('is_read', false)

        totalUnread += count || 0
      }

      setUnreadCount(totalUnread)
    } catch (error) {
      console.error('Error fetching unread count:', error)
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  // Auto-refresh unread count when page becomes visible
  useEffect(() => {
    if (!user) return

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUnreadCount()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Also refresh every 30 seconds if page is visible
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchUnreadCount()
      }
    }, 30000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [user, fetchUnreadCount])

  return {
    unreadCount,
    loading,
    refetch: fetchUnreadCount
  }
}