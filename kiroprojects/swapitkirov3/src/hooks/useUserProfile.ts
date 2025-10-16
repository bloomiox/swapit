'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  location_name: string | null
  phone: string | null
  is_verified: boolean
  is_active: boolean
  rating_average: number
  rating_count: number
  successful_swaps: number
  created_at: string
  updated_at: string
}

export interface UserStats {
  total_items: number
  active_items: number
  total_swaps: number
  completed_swaps: number
  rating_average: number
  rating_count: number
  saved_items_count: number
  reviews_count: number
}

// Hook for current user's profile
export function useCurrentUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    // Check if user's email is confirmed (for email signups)
    const isEmailProvider = user.app_metadata?.providers?.includes('email')
    const isEmailConfirmed = user.email_confirmed_at !== null
    
    if (isEmailProvider && !isEmailConfirmed) {
      console.log('User email not confirmed yet, skipping profile fetch')
      setError('Email not confirmed. Please check your email and confirm your account.')
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile for user:', user.id)
          console.log('User metadata:', user.user_metadata)
          
          try {
            console.log('Attempting to create profile with data:', {
              id: user.id,
              email: user.email,
              display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'User'
            })

            const { data: newProfile, error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'User'
              })
              .select('*')
              .single()

            if (insertError) {
              console.error('Error creating profile:', insertError)
              console.error('Insert error details:', {
                code: insertError.code,
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint
              })
              throw insertError
            }

            console.log('Profile created successfully:', newProfile)
            setProfile(newProfile)
            return
          } catch (createError) {
            console.error('Failed to create profile:', createError)
            // If profile creation fails, still throw the original error
            throw error
          }
        }
        
        console.error('Profile fetch error:', error)
        throw error
      }

      setProfile(data)
    } catch (err) {
      console.error('Error in fetchProfile:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('Profile update event received, refetching profile...')
      fetchProfile()
    }

    const { addProfileUpdateListener, removeProfileUpdateListener } = require('@/lib/events')
    addProfileUpdateListener(handleProfileUpdate)
    
    return () => {
      removeProfileUpdateListener(handleProfileUpdate)
    }
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  }
}

// Hook for any user's profile by ID
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  }
}

// Hook for user statistics
export function useUserStats(userId?: string) {
  const { user } = useAuth()
  const targetUserId = userId || user?.id
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!targetUserId) {
      setStats(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Verify user profile exists
      const { error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', targetUserId)
        .single()

      if (userError) throw userError

      // Fetch active items count
      const { count: activeItemsCount, error: itemsError } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId)
        .eq('is_available', true)

      if (itemsError) throw itemsError

      // Fetch saved items count
      const { count: savedItemsCount, error: savedError } = await supabase
        .from('saved_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId)

      if (savedError) throw savedError

      // For now, set default values since these tables don't exist yet
      const reviewsCount = 0
      const completedSwapsCount = 0

      const statsData: UserStats = {
        total_items: activeItemsCount || 0,
        active_items: activeItemsCount || 0,
        total_swaps: 0,
        completed_swaps: completedSwapsCount || 0,
        rating_average: 0,
        rating_count: 0,
        saved_items_count: savedItemsCount || 0,
        reviews_count: reviewsCount || 0
      }

      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [targetUserId])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

// Hook for profile actions
export function useProfileActions() {
  const { user } = useAuth()

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error
    
    // Dispatch profile update event
    const { dispatchProfileUpdate } = await import('@/lib/events')
    dispatchProfileUpdate()
  }

  const ensureUserProfile = async () => {
    if (!user) throw new Error('User not authenticated')

    // Check if user profile exists
    const { error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      // User doesn't exist, create profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'User'
        })

      if (insertError) {
        throw insertError
      }
    } else if (checkError) {
      throw checkError
    }
  }

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated')

    // Ensure user profile exists
    await ensureUserProfile()

    const fileExt = file.name.split('.').pop()
    const fileName = `avatar.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    // Upload file to Supabase Storage (upsert to replace existing)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Update user profile with new avatar URL
    await updateProfile({ avatar_url: data.publicUrl })

    return data.publicUrl
  }

  const deleteAvatar = async () => {
    if (!user) throw new Error('User not authenticated')

    // Get current avatar URL to extract file path
    const { data: profile } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single()

    if (profile?.avatar_url) {
      // Extract file path from URL - should be in format: userId/avatar.ext
      const url = new URL(profile.avatar_url)
      const pathParts = url.pathname.split('/')
      const filePath = pathParts.slice(-2).join('/') // Get last two parts: userId/avatar.ext

      // Delete from storage
      await supabase.storage
        .from('avatars')
        .remove([filePath])
    }

    // Update profile to remove avatar URL
    await updateProfile({ avatar_url: null })
  }

  return {
    updateProfile,
    uploadAvatar,
    deleteAvatar
  }
}