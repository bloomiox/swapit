'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/?error=auth_callback_failed')
          return
        }

        if (data.session) {
          const user = data.session.user
          console.log('Auth callback successful for user:', user.email)
          console.log('User email confirmed:', user.email_confirmed_at !== null)
          console.log('User providers:', user.app_metadata?.providers)
          
          // Small delay to ensure the auth state is propagated
          setTimeout(() => {
            router.push('/')
          }, 500)
        } else {
          console.log('No session found, redirecting to home')
          router.push('/')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        router.push('/?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
          Completing sign in...
        </p>
      </div>
    </div>
  )
}