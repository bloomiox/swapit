'use client'

import React, { createContext, useContext } from 'react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { OnboardingModal } from '@/components/modals/OnboardingModal'

interface OnboardingContextType {
  shouldShowOnboarding: boolean
  isCheckingOnboardingStatus: boolean
  completeOnboarding: () => void
  recheckOnboardingStatus: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const onboardingState = useOnboarding()

  return (
    <OnboardingContext.Provider value={onboardingState}>
      {children}
      
      {/* Global Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingState.shouldShowOnboarding}
        onClose={() => {}} // Prevent closing - user must complete onboarding
        onComplete={onboardingState.completeOnboarding}
      />
    </OnboardingContext.Provider>
  )
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider')
  }
  return context
}