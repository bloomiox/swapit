'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export function useEmailConfirmation() {
  const { user } = useAuth()

  const isEmailProvider = user?.app_metadata?.providers?.includes('email') || false
  const isEmailConfirmed = user?.email_confirmed_at !== null
  const needsEmailConfirmation = isEmailProvider && !isEmailConfirmed

  const resendConfirmationEmail = async () => {
    if (!user?.email) {
      throw new Error('No email address found')
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email
    })

    if (error) {
      throw error
    }
  }

  return {
    isEmailProvider,
    isEmailConfirmed,
    needsEmailConfirmation,
    resendConfirmationEmail
  }
}