'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Item } from './useItems'

// Hook for featured items in user's area (location-based)
export function useFeaturedItemsForYou() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedItems = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get user's location from profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('location_name')
        .eq('id', user.id)
        .single()

      // For now, get popular items (most viewed/saved) in general
      // In a real app, you'd use location-based filtering
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('is_available', true)
        .neq('user_id', user.id) // Exclude user's own items
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error

      setItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured items')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchFeaturedItems()
  }, [fetchFeaturedItems])

  return {
    items,
    loading,
    error,
    refetch: fetchFeaturedItems
  }
}

// Hook for recommended items based on user's interests
export function useRecommendedItems() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendedItems = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get user's interests/preferences
      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('categories_of_interest')
        .eq('user_id', user.id)
        .maybeSingle()

      let query = supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('is_available', true)
        .neq('user_id', user.id) // Exclude user's own items

      // If user has category preferences, filter by them
      if (userPrefs?.categories_of_interest && userPrefs.categories_of_interest.length > 0) {
        query = query.in('category_id', userPrefs.categories_of_interest)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error

      setItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommended items')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchRecommendedItems()
  }, [fetchRecommendedItems])

  return {
    items,
    loading,
    error,
    refetch: fetchRecommendedItems
  }
}

// Hook for trending items (most viewed and requested)
export function useTrendingItems() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrendingItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get items with highest view count and swap request count
      // For now, we'll use view_count as the primary metric
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('is_available', true)
        .neq('user_id', user?.id || '') // Exclude user's own items if logged in
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error

      setItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending items')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchTrendingItems()
  }, [fetchTrendingItems])

  return {
    items,
    loading,
    error,
    refetch: fetchTrendingItems
  }
}

// Hook for all items (explore more) - excludes items from other sections
export function useExploreMoreItems(excludeItemIds: string[] = []) {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExploreItems = useCallback(async () => {
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

      // Exclude user's own items if logged in
      if (user?.id) {
        query = query.neq('user_id', user.id)
      }

      // Exclude already shown items if any
      if (excludeItemIds.length > 0) {
        query = query.not('id', 'in', `(${excludeItemIds.join(',')})`)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(30) // Get more items for better diversity

      if (error) throw error

      // Shuffle the results to provide more variety instead of just newest items
      const shuffledItems = (data || []).sort(() => Math.random() - 0.5).slice(0, 8)
      setItems(shuffledItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch explore items')
    } finally {
      setLoading(false)
    }
  }, [user, excludeItemIds])

  useEffect(() => {
    fetchExploreItems()
  }, [fetchExploreItems])

  return {
    items,
    loading,
    error,
    refetch: fetchExploreItems
  }
}