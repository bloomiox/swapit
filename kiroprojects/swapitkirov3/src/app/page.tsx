'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FeaturedItems } from '@/components/sections/FeaturedItems'
import { WhyChooseSwapIt } from '@/components/sections/WhyChooseSwapIt'
import { DownloadApp } from '@/components/sections/DownloadApp'
import { Footer } from '@/components/layout/Footer'
import { OnboardingModal } from '@/components/modals/OnboardingModal'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Check if we should show onboarding
    const shouldShowOnboarding = searchParams.get('onboarding') === 'true'
    
    if (shouldShowOnboarding && user && !loading) {
      setShowOnboarding(true)
      // Clean up the URL
      router.replace('/', undefined)
    }
  }, [searchParams, user, loading, router])

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false)
    
    // Redirect to browse page (onboarding completion is handled in the modal)
    router.push('/browse')
  }

  return (
    <main className="min-h-screen px-2.5">
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturedItems />
      <WhyChooseSwapIt />
      <DownloadApp />
      <Footer />
      
      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </main>
  )
}