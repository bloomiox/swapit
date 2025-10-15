'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation'
import { supabase } from '@/lib/supabase'

export function useOnboarding() {
  const { user } = useAuth()
  const { needsEmailConfirmation } = useEmailConfirmation()
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)
  const [isCheckingOnboardingStatus, setIsCheckingOnboardingStatus] = useState(true)

  useEffect(() => {
    // Add a small delay to ensure auth state is fully settled
    const timer = setTimeout(() => {
      checkOnboardingStatus()
    }, 100)

    return () => clearTimeout(timer)
  }, [user, needsEmailConfirmation])

  const checkOnboardingStatus = async () => {
    if (!user) {
      setShouldShowOnboarding(false)
      setIsCheckingOnboardingStatus(false)
      return
    }

    // If user needs email confirmation, don't show onboarding yet
    if (needsEmailConfirmation) {
      setShouldShowOnboarding(false)
      setIsCheckingOnboardingStatus(false)
      return
    }

    try {
      setIsCheckingOnboardingStatus(true)

      // Check if user has completed onboarding by looking at user_preferences
      const { data: userPreferences, error } = await supabase
        .from('user_preferences')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code === 'PGRST116') {
        // User preferences don't exist, user needs onboarding
        console.log('User preferences not found, showing onboarding')
        setShouldShowOnboarding(true)
      } else if (userPreferences) {
        // User preferences exist, check onboarding status
        const needsOnboarding = !userPreferences.onboarding_completed
        console.log('User preferences found, onboarding completed:', userPreferences.onboarding_completed)
        setShouldShowOnboarding(needsOnboarding)
      } else {
        // Fallback: show onboarding
        console.log('Fallback: showing onboarding')
        setShouldShowOnboarding(true)
      }
    } catch (err) {
      console.error('Error checking onboarding status:', err)
      setShouldShowOnboarding(true) // Default to showing onboarding if there's an error
    } finally {
      setIsCheckingOnboardingStatus(false)
    }
  }

  const completeOnboarding = () => {
    setShouldShowOnboarding(false)
  }

  return {
    shouldShowOnboarding,
    isCheckingOnboardingStatus,
    completeOnboarding,
    recheckOnboardingStatus: checkOnboardingStatus
  }
}