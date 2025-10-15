'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ForgotPasswordModal } from './ForgotPasswordModal'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { signIn, signInWithProvider } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        setError(error.message)
      } else {
        // Success - close modal
        onClose()
        setFormData({ email: '', password: '' })
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await signInWithProvider(provider)
      
      if (error) {
        setError(error.message)
      }
      // Note: For OAuth, the user will be redirected, so we don't close the modal here
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false)
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 
            className="text-h4 mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome Back
          </h2>
          <p 
            className="text-body-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Login to continue swapping
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label 
              className="block text-body-small-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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

          {/* Password Field */}
          <div className="space-y-2">
            <label 
              className="block text-body-small-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                ) : (
                  <Eye className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-body-small-bold text-primary hover:opacity-80 transition-opacity"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <Button 
            variant="primary" 
            size="large" 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="flex-1 h-px"
            style={{ backgroundColor: 'var(--border-color)' }}
          />
          <span 
            className="text-body-small px-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            OR
          </span>
          <div 
            className="flex-1 h-px"
            style={{ backgroundColor: 'var(--border-color)' }}
          />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2 mb-6">
          <Button 
            variant="outlined" 
            size="large" 
            className="w-full flex items-center justify-center gap-3"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.1713 8.36788H17.5001V8.33329H10.0001V11.6666H14.7096C14.023 13.6069 12.1763 15 10.0001 15C7.23884 15 5.00009 12.7612 5.00009 9.99996C5.00009 7.23871 7.23884 4.99996 10.0001 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1859 2.52204 12.1951 1.66663 10.0001 1.66663C5.39801 1.66663 1.66675 5.39788 1.66675 9.99996C1.66675 14.602 5.39801 18.3333 10.0001 18.3333C14.6022 18.3333 18.3334 14.602 18.3334 9.99996C18.3334 9.44121 18.2759 8.89579 18.1713 8.36788Z" fill="#FFC107"/>
                <path d="M2.62744 6.12121L5.36536 8.12913C6.10619 6.29496 7.90036 4.99996 9.99994 4.99996C11.2744 4.99996 12.434 5.48079 13.3169 6.26621L15.674 3.90913C14.1857 2.52204 12.1949 1.66663 9.99994 1.66663C6.79911 1.66663 4.02327 3.47371 2.62744 6.12121Z" fill="#FF3D00"/>
                <path d="M10.0001 18.3333C12.1526 18.3333 14.1101 17.5095 15.5876 16.17L13.0084 13.9875C12.1434 14.6452 11.0801 15.0008 10.0001 15C7.82594 15 5.98094 13.6091 5.29177 11.6708L2.58344 13.7583C3.96094 16.4816 6.7701 18.3333 10.0001 18.3333Z" fill="#4CAF50"/>
                <path d="M18.1713 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0084 13.9871L15.5876 16.1696C15.4042 16.3363 18.3333 14.1667 18.3333 10C18.3333 9.44129 18.2758 8.89587 18.1713 8.36796Z" fill="#1976D2"/>
              </svg>
            </div>
            Continue with Google
          </Button>
          
          <Button 
            variant="outlined" 
            size="large" 
            className="w-full flex items-center justify-center gap-3"
            onClick={() => handleSocialLogin('apple')}
            disabled={loading}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.3125 10.3906C15.3047 9.125 15.7031 8.07812 16.5078 7.25C15.9844 6.42188 15.1562 5.96094 14.0234 5.86719C12.9375 5.77344 11.7812 6.53125 11.2812 6.53125C10.7656 6.53125 9.76562 5.89844 8.95312 5.89844C7.20312 5.92969 5.35938 7.28125 5.35938 10.0469C5.35938 10.8594 5.5 11.7031 5.78125 12.5781C6.14062 13.6719 7.73438 16.7969 9.5 16.7344C10.2812 16.7188 10.8281 16.1562 11.8125 16.1562C12.7656 16.1562 13.2656 16.7344 14.1094 16.7344C15.8906 16.7031 17.3281 13.8906 17.6719 12.7812C15.6406 11.7031 15.3125 10.4375 15.3125 10.3906ZM13.5 4.85938C14.1719 4.04688 14.1094 3.32812 14.0938 3.04688C13.4844 3.07812 12.7656 3.46875 12.3594 3.92188C11.9219 4.40625 11.6719 5.01562 11.7344 5.70312C12.3906 5.75 13.0156 5.39062 13.5 4.85938Z" fill="currentColor"/>
              </svg>
            </div>
            Continue with Apple
          </Button>
        </div>

        {/* Switch to Signup */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-body-medium-bold text-primary hover:opacity-80 transition-opacity"
          >
            Don't have an account? Join us
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={handleCloseForgotPassword}
        onBackToLogin={handleBackToLogin}
      />
    </Modal>
  )
}