'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function PrivacySettings() {
  const { user, signOut } = useAuth()
  const [showDeleteDataConfirm, setShowDeleteDataConfirm] = useState(false)
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDeleteData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { error } = await supabase.rpc('delete_user_data', {
        user_id: user.id
      })

      if (error) {
        console.error('Error deleting user data:', error)
        alert('Failed to delete data. Please try again.')
        return
      }

      alert('Your data has been successfully deleted.')
      setShowDeleteDataConfirm(false)
    } catch (error) {
      console.error('Error deleting user data:', error)
      alert('Failed to delete data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { error } = await supabase.rpc('delete_user_account', {
        user_id: user.id
      })

      if (error) {
        console.error('Error deleting account:', error)
        alert('Failed to delete account. Please try again.')
        return
      }

      alert('Your account has been successfully deleted.')
      await signOut()
      // Redirect to home page after account deletion
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (showDeleteDataConfirm) {
    return (
      <div>
        <div className="mb-6">
          <h1 
            className="text-h3 font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Delete My Data
          </h1>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <div 
                className="font-medium text-body-normal mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Are you sure you want to delete all your data?
              </div>
              <div 
                className="text-caption"
                style={{ color: 'var(--text-secondary)' }}
              >
                This will permanently delete all your items, swap requests, messages, and reviews. 
                Your account will remain active but all data will be lost. This action cannot be undone.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteDataConfirm(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteData}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete My Data'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showDeleteAccountConfirm) {
    return (
      <div>
        <div className="mb-6">
          <h1 
            className="text-h3 font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Delete Account
          </h1>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <div 
                className="font-medium text-body-normal mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Are you sure you want to delete your account?
              </div>
              <div 
                className="text-caption"
                style={{ color: 'var(--text-secondary)' }}
              >
                This will permanently delete your account and all associated data including items, 
                swap requests, messages, and reviews. This action cannot be undone and you will be 
                immediately signed out.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteAccountConfirm(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 
          className="text-h3 font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Privacy & Security
        </h1>
        <p 
          className="text-body-normal"
          style={{ color: 'var(--text-secondary)' }}
        >
          Manage your data and account security settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Management Section */}
        <div>
          <h3 
            className="text-h5 font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Data Management
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                 style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium text-body-normal text-red-600 dark:text-red-400">
                    Delete My Data
                  </div>
                  <div 
                    className="text-caption"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Remove all your data but keep your account
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteDataConfirm(true)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                 style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium text-body-normal text-red-600 dark:text-red-400">
                    Delete Account
                  </div>
                  <div 
                    className="text-caption"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Permanently delete your account and all data
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteAccountConfirm(true)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div 
          className="p-4 rounded-xl"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <h4 
            className="font-medium text-body-normal mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Data Protection
          </h4>
          <p 
            className="text-caption"
            style={{ color: 'var(--text-secondary)' }}
          >
            We take your privacy seriously. Your data is encrypted and stored securely. 
            You have full control over your information and can delete it at any time.
          </p>
        </div>
      </div>
    </div>
  )
}