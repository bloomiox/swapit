'use client'

import React, { useState } from 'react'

export function useAuthModals() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  const openLogin = () => {
    setIsSignUpOpen(false)
    setIsOnboardingOpen(false)
    setIsLoginOpen(true)
  }

  const openSignUp = () => {
    setIsLoginOpen(false)
    setIsOnboardingOpen(false)
    setIsSignUpOpen(true)
  }

  const openOnboarding = () => {
    setIsLoginOpen(false)
    setIsSignUpOpen(false)
    setIsOnboardingOpen(true)
  }

  const closeAll = () => {
    setIsLoginOpen(false)
    setIsSignUpOpen(false)
    setIsOnboardingOpen(false)
  }

  return {
    isLoginOpen,
    isSignUpOpen,
    isOnboardingOpen,
    openLogin,
    openSignUp,
    openOnboarding,
    closeAll
  }
}