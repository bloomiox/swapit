'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface Notification {
  id: string
  user_id: string
  type: 'swap_request' | 'claim_request' | 'message' | 'system' | 'review'
  title: string
  message: string
  data: any
  is_read: boolean
  created_at: string
}

// Hook for fetching user notifications
export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount((data || []).filter(n => !n.is_read).length)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [user])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refetch: fetchNotifications
  }
}

// Hook for notification actions
export function useNotificationActions() {
  const { user } = useAuth()

  const createNotification = async (data: {
    user_id: string
    type: 'swap_request' | 'claim_request' | 'message' | 'system' | 'review'
    title: string
    message: string
    data?: any
  }) => {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {}
      })

    if (error) throw error
  }

  const markAsRead = async (notificationId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) throw error
  }

  const markAllAsRead = async () => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) throw error
  }

  const deleteNotification = async (notificationId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) throw error
  }

  return {
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}

// Utility functions for notification display
export function getNotificationIcon(type: string) {
  switch (type) {
    case 'swap_request':
      return 'RotateCcw'
    case 'claim_request':
      return 'Gift'
    case 'message':
      return 'MessageCircle'
    case 'review':
      return 'Star'
    case 'system':
    default:
      return 'Info'
  }
}

export function getNotificationColor(type: string) {
  switch (type) {
    case 'swap_request':
      return '#119C21'
    case 'claim_request':
      return '#E1B517'
    case 'message':
      return '#3B82F6'
    case 'review':
      return '#F59E0B'
    case 'system':
    default:
      return '#6B7280'
  }
}