'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  parent_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        throw error
      }

      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  }
}

// Hook to create a new item
export function useCreateItem() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ensureUserProfile = async (userId: string) => {
    // Check if user profile exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (checkError && checkError.code === 'PGRST116') {
      // User doesn't exist, get auth user data and create profile
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        throw new Error('User not authenticated')
      }

      // Create user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || authUser.email || 'User'
        })

      if (insertError) {
        throw insertError
      }
    } else if (checkError) {
      throw checkError
    }
  }

  const createItem = async (itemData: {
    title: string
    description: string | null
    category_id: string
    condition: 'like_new' | 'good' | 'fair' | 'poor'
    is_free: boolean
    images?: string[] | null
    location_name: string
    location_coordinates?: { lat: number; lng: number }
    looking_for?: string | null
  }) => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw new Error('User authentication failed')
      }
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Ensure user profile exists
      await ensureUserProfile(user.id)

      // Create the item
      const insertData = {
        title: itemData.title,
        description: itemData.description,
        category_id: itemData.category_id,
        condition: itemData.condition,
        is_free: itemData.is_free,
        images: itemData.images || [],
        location_name: itemData.location_name,
        location_coordinates: itemData.location_coordinates 
          ? `POINT(${itemData.location_coordinates.lng} ${itemData.location_coordinates.lat})`
          : null,
        looking_for: itemData.looking_for,
        user_id: user.id
      }
      
      const { data, error } = await supabase
        .from('items')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    createItem,
    loading,
    error
  }
}

// Get category by ID
export function useCategory(categoryId: string | null) {
  const { categories } = useCategories()
  return categories.find(cat => cat.id === categoryId) || null
}

// Get category options for forms
export function useCategoryOptions() {
  const { categories, loading, error } = useCategories()
  
  const options = categories.map(category => ({
    value: category.id,
    label: category.name,
    icon: category.icon
  }))

  return {
    options,
    loading,
    error
  }
}