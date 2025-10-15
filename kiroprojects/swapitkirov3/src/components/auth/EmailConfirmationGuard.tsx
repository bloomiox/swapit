'use client'

import React, { useState } from 'react'
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Mail, RefreshCw } from 'lucide-react'

interface EmailConfirmationGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function EmailConfirmationGuard({ children, fallback }: EmailConfirmationGuardProps) {
  const { user } = useAuth()
  const { needsEmailConfirmation, resendConfirmationEmail } = useEmailConfirmation()
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResendEmail = async () => {
    try {
      setIsResending(true)
      await resendConfirmationEmail()
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 3000)
    } catch (error) {
      console.error('Error resending confirmation email:', error)
    } finally {
      setIsResending(false)
    }
  }

  if (needsEmailConfirmation) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>
            Check Your Email
          </h1>
          
          <p className="text-body-large mb-4" style={{ color: 'var(--text-secondary)' }}>
            We've sent a confirmation link to your email address. Please click the link to verify your account and continue.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700 mb-1">Confirmation email sent to:</p>
            <p className="text-sm font-semibold text-blue-800">{user?.email}</p>
          </div>

          <div className="space-y-3">
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              I've Confirmed My Email
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Confirmation Email
                </>
              )}
            </Button>
            
            {resendSuccess && (
              <p className="text-sm text-green-600">
                ✓ Confirmation email sent successfully!
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}