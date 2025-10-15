'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function AccountSettings() {
  const { user } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChangePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match or are empty.')
      return
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error('Error changing password:', error)
        alert('Failed to change password. Please try again.')
        return
      }

      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setShowChangePassword(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 
          className="text-h3 font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Account Settings
        </h1>
        <p 
          className="text-body-normal"
          style={{ color: 'var(--text-secondary)' }}
        >
          Manage your account security and authentication settings.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-green-700 dark:text-green-300 font-medium">
            Password changed successfully!
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Account Information */}
        <div>
          <h3 
            className="text-h5 font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Account Information
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border"
                 style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div 
                  className="font-medium text-body-normal"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Email Address
                </div>
                <div 
                  className="text-caption"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {user?.email || 'Not available'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border"
                 style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div 
                  className="font-medium text-body-normal"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Account Created
                </div>
                <div 
                  className="text-caption"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 
            className="text-h5 font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Security
          </h3>
          
          {!showChangePassword ? (
            <div className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                 style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                <div>
                  <div 
                    className="font-medium text-body-normal"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Change Password
                  </div>
                  <div 
                    className="text-caption"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Update your account password for better security
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border space-y-4"
                 style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <label 
                  className="block text-body-normal font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    placeholder="Enter new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label 
                  className="block text-body-normal font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowChangePassword(false)
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  className="flex-1"
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Security Information */}
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <h4 
            className="font-medium text-body-normal mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Security Tips
          </h4>
          <ul 
            className="text-caption space-y-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>• Use a strong password with at least 8 characters</li>
            <li>• Include uppercase, lowercase, numbers, and special characters</li>
            <li>• Don't reuse passwords from other accounts</li>
            <li>• Consider using a password manager</li>
          </ul>
        </div>
      </div>
    </div>
  )
}