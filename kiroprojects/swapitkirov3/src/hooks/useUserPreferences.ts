'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface UserPreferences {
  categories_of_interest: string[]
  interested_categories: {
    id: string
    name: string
  }[]
}

export function useUserPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setPreferences(null)
      setLoading(false)
      return
    }

    const fetchUserPreferences = async () => {
      try {
        setLoading(true)
        setError(null)

        // First get the user preferences
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('user_preferences')
          .select('categories_of_interest')
          .eq('user_id', userId)
          .single()

        if (preferencesError) {
          if (preferencesError.code === 'PGRST116') {
            // No preferences found, return empty
            setPreferences({
              categories_of_interest: [],
              interested_categories: []
            })
            setLoading(false)
            return
          }
          throw preferencesError
        }

        if (!preferencesData?.categories_of_interest || preferencesData.categories_of_interest.length === 0) {
          setPreferences({
            categories_of_interest: [],
            interested_categories: []
          })
          setLoading(false)
          return
        }

        // Then get the category names for those IDs
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', preferencesData.categories_of_interest)

        if (categoriesError) {
          throw categoriesError
        }

        setPreferences({
          categories_of_interest: preferencesData.categories_of_interest,
          interested_categories: categoriesData || []
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user preferences')
        setPreferences(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPreferences()
  }, [userId])

  return {
    preferences,
    loading,
    error
  }
}