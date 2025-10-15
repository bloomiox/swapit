'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToLogin: () => void
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  const handleBackToLogin = () => {
    setEmail('')
    setError(null)
    setSuccess(false)
    onBackToLogin()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBackToLogin}
            className="flex items-center gap-2 mb-4 text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-body-small-bold">Back to Login</span>
          </button>
          
          <h2 
            className="text-h4 mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Reset Password
          </h2>
          <p 
            className="text-body-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {success 
              ? "We've sent you a password reset link"
              : "Enter your email address and we'll send you a link to reset your password"
            }
          </p>
        </div>

        {success ? (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h3 
              className="text-h5 mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Check your email
            </h3>
            <p 
              className="text-body-medium mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Button 
              variant="primary" 
              size="large" 
              className="w-full"
              onClick={handleBackToLogin}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          /* Form State */
          <>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  className="block text-body-small-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: johndoe@gmail.com"
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                variant="primary" 
                size="large" 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        )}
      </div>
    </Modal>
  )
}