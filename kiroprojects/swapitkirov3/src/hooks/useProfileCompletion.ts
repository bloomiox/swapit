'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export function useProfileCompletion() {
  const { user } = useAuth()
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [hasInterests, setHasInterests] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) {
        setIsProfileComplete(false)
        setHasInterests(false)
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Check user preferences and onboarding status
        const { data: userPrefs, error } = await supabase
          .from('user_preferences')
          .select('onboarding_completed, categories_of_interest')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking profile completion:', error)
          setIsProfileComplete(false)
          setHasInterests(false)
        } else if (userPrefs) {
          const onboardingComplete = userPrefs.onboarding_completed || false
          const hasCategories = userPrefs.categories_of_interest && userPrefs.categories_of_interest.length > 0
          
          setIsProfileComplete(onboardingComplete)
          setHasInterests(hasCategories)
        } else {
          // No user preferences record means profile is not complete
          setIsProfileComplete(false)
          setHasInterests(false)
        }
      } catch (err) {
        console.error('Error checking profile completion:', err)
        setIsProfileComplete(false)
        setHasInterests(false)
      } finally {
        setLoading(false)
      }
    }

    checkProfileCompletion()
  }, [user])

  return {
    isProfileComplete,
    hasInterests,
    loading
  }
}