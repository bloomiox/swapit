'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface Item {
  id: string
  user_id: string
  category_id: string | null
  title: string
  description: string
  condition: 'like_new' | 'good' | 'fair' | 'poor'
  is_free: boolean
  images: string[] | null
  location_name: string | null
  location_coordinates: any | null
  is_available: boolean
  is_boosted: boolean
  boost_type: 'premium' | 'featured' | 'urgent' | null
  boost_expires_at: string | null
  view_count: number
  save_count: number
  looking_for: string | null
  created_at: string
  updated_at: string
  // Joined data
  category?: {
    id: string
    name: string
    description: string | null
    icon: string | null
  }
  user?: {
    id: string
    full_name: string | null
    avatar_url: string | null
    rating_average: number | null
    rating_count: number
  }
}

export interface ItemFilters {
  category_ids?: string[]
  condition?: 'like_new' | 'good' | 'fair' | 'poor'
  is_free?: boolean
  search_query?: string
  user_lat?: number
  user_lng?: number
  max_distance_km?: number
}

export function useItems(filters?: ItemFilters) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('is_available', true)
        .order('is_boosted', { ascending: false })
        .order('boost_type', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.category_ids && filters.category_ids.length > 0) {
        query = query.in('category_id', filters.category_ids)
      }

      if (filters?.condition) {
        query = query.eq('condition', filters.condition)
      }

      if (filters?.is_free !== undefined) {
        query = query.eq('is_free', filters.is_free)
      }

      if (filters?.search_query) {
        query = query.textSearch('title,description', filters.search_query)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    refetch: fetchItems
  }
}

export function useUserItems(userId?: string) {
  const { user } = useAuth()
  const targetUserId = userId || user?.id
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserItems = async () => {
    if (!targetUserId) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('user_id', targetUserId)
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserItems()
  }, [targetUserId])

  return {
    items,
    loading,
    error,
    refetch: fetchUserItems
  }
}

export function useSavedItems() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSavedItems = async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('saved_items')
        .select(`
          item:items(
            *,
            category:categories(id, name, description, icon),
            user:users(id, full_name, avatar_url, rating_average, rating_count)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Extract items from the join
      const savedItems = data?.map((saved: any) => saved.item).filter(Boolean) || []
      setItems(savedItems as Item[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedItems()
  }, [user])

  return {
    items,
    loading,
    error,
    refetch: fetchSavedItems
  }
}

// Hook for single item
export function useItem(itemId: string) {
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItem = useCallback(async () => {
    if (!itemId) return
    
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('id', itemId)
        .eq('is_available', true)
        .single()

      if (error) {
        throw error
      }

      setItem(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch item')
    } finally {
      setLoading(false)
    }
  }, [itemId])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

  return {
    item,
    loading,
    error,
    refetch: fetchItem
  }
}

// Hook for item actions
export function useItemActions() {
  const { user } = useAuth()

  const saveItem = useCallback(async (itemId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('saved_items')
      .insert({ user_id: user.id, item_id: itemId })

    if (error) throw error
  }, [user])

  const unsaveItem = useCallback(async (itemId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', itemId)

    if (error) throw error
  }, [user])

  const deleteItem = useCallback(async (itemId: string, reason?: string) => {
    if (!user) throw new Error('User not authenticated')

    // Log the deletion reason if provided
    if (reason) {
      try {
        await supabase
          .from('item_deletion_logs')
          .insert({
            item_id: itemId,
            user_id: user.id,
            reason: reason,
            action: 'delete'
          })
      } catch (logError) {
        // Don't fail deletion if logging fails
        console.error('Failed to log deletion reason:', logError)
      }
    }

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id) // Ensure user owns the item

    if (error) throw error
  }, [user])

  const deactivateItem = useCallback(async (itemId: string, reason?: string) => {
    if (!user) throw new Error('User not authenticated')

    // Log the deactivation reason if provided
    if (reason) {
      try {
        await supabase
          .from('item_deletion_logs')
          .insert({
            item_id: itemId,
            user_id: user.id,
            reason: reason,
            action: 'deactivate'
          })
      } catch (logError) {
        // Don't fail deactivation if logging fails
        console.error('Failed to log deactivation reason:', logError)
      }
    }

    const { error } = await supabase
      .from('items')
      .update({ is_available: false })
      .eq('id', itemId)
      .eq('user_id', user.id) // Ensure user owns the item

    if (error) throw error
  }, [user])

  const updateItem = useCallback(async (itemId: string, updates: Partial<Item>) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', itemId)
      .eq('user_id', user.id) // Ensure user owns the item

    if (error) throw error
  }, [user])

  const checkIfSaved = useCallback(async (itemId: string): Promise<boolean> => {
    if (!user || !itemId) return false

    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .maybeSingle()

      if (error) {
        console.error('Error checking if item is saved:', error)
        return false
      }

      return !!data
    } catch (err) {
      console.error('Error checking if item is saved:', err)
      return false
    }
  }, [user])

  return {
    saveItem,
    unsaveItem,
    deleteItem,
    deactivateItem,
    updateItem,
    checkIfSaved
  }
}