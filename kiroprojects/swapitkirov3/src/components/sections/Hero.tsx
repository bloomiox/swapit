'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { LoginModal } from '@/components/modals/LoginModal'
import { SignUpModal } from '@/components/modals/SignUpModal'
import { OnboardingModal } from '@/components/modals/OnboardingModal'
import { useAuthModals } from '@/hooks/useAuthModals'

export function Hero() {
  const { isLoginOpen, isSignUpOpen, isOnboardingOpen, openLogin, openSignUp, openOnboarding, closeAll } = useAuthModals()
  return (
    <section style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-[119px] px-4 md:px-6 lg:px-[165px] py-section-mobile md:py-section-tablet lg:py-6">
        {/* Content */}
        <div className="flex flex-col gap-6 lg:gap-10 w-full lg:w-[543px] text-center lg:text-left">
          {/* Text Content */}
          <div className="flex flex-col gap-4">
            <h1 
              className="text-h1"
              style={{ color: 'var(--text-primary)' }}
            >
              Swap. Share. Sustain.
            </h1>
            <p 
              className="text-body-large max-w-lg mx-auto lg:mx-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join the circular economy! Exchange items you no longer need and discover amazing finds from your community.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-2">
            <Button variant="primary" size="large" className="w-full sm:w-auto" onClick={openSignUp}>
              Get Started
            </Button>
            <Button variant="outlined" size="large" className="w-full sm:w-auto">
              Browse Items
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-[448px] h-[300px] sm:h-[400px] lg:w-[448px] lg:h-[483px] order-first lg:order-last">
          {/* Background Shape */}
          <div className="absolute top-3 lg:top-5 left-1/2 transform -translate-x-1/2 lg:left-[37px] lg:transform-none w-[280px] sm:w-[320px] lg:w-[379px] h-[280px] sm:h-[380px] lg:h-[463px] bg-boost-banner rounded-t-[1000px]" />
          
          {/* Main Image */}
          <div className="absolute -top-4 lg:-top-[25px] left-1/2 transform -translate-x-1/2 lg:left-1 lg:transform-none w-[300px] sm:w-[360px] lg:w-[442px] h-[280px] sm:h-[400px] lg:h-[521px]">
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Hero Image Placeholder</span>
            </div>
          </div>

          {/* Floating Icons - Hidden on mobile for cleaner look */}
          <div className="hidden lg:block">
            <div className="absolute top-[301px] left-[384px] w-14 h-14 bg-general-white dark:bg-dark-card rounded-full shadow-cards flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-dark-bg-tertiary rounded" />
            </div>
            
            <div className="absolute top-[348px] left-[57px] w-14 h-14 bg-general-white dark:bg-dark-card rounded-full shadow-cards flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-dark-bg-tertiary rounded" />
            </div>
            
            <div className="absolute top-[33px] left-[314px] w-14 h-14 bg-general-white dark:bg-dark-card rounded-full shadow-cards flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-dark-bg-tertiary rounded" />
            </div>
            
            <div className="absolute top-[299px] left-[201px] w-14 h-14 bg-general-white dark:bg-dark-card rounded-full shadow-cards flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-dark-bg-tertiary rounded" />
            </div>
            
            <div className="absolute top-[18px] left-[113px] w-14 h-14 bg-general-white dark:bg-dark-card rounded-full shadow-cards flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-dark-bg-tertiary rounded" />
            </div>
          </div>
        </div>

        {/* Auth Modals */}
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={closeAll} 
          onSwitchToSignup={openSignUp} 
        />
        <SignUpModal 
          isOpen={isSignUpOpen} 
          onClose={closeAll} 
          onSwitchToLogin={openLogin}
          onSignUpSuccess={openOnboarding}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={closeAll}
          onComplete={closeAll}
        />
      </div>
    </section>
  )
}