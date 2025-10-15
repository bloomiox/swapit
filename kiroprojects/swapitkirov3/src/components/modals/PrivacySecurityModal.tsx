'use client'

import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Trash2, Shield, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface PrivacySecurityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacySecurityModal({
  isOpen,
  onClose
}: PrivacySecurityModalProps) {
  const { user, signOut } = useAuth()
  const [showDeleteDataConfirm, setShowDeleteDataConfirm] = useState(false)
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleDeleteData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Delete user data but keep account
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
      onClose()
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
      // Delete entire account
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

      alert('Password changed successfully.')
      setNewPassword('')
      setConfirmPassword('')
      setShowChangePassword(false)
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (showDeleteDataConfirm) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          <h2 
            className="text-h3 font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Delete My Data
          </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
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
      </Modal>
    )
  }

  if (showDeleteAccountConfirm) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          <h2 
            className="text-h3 font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Delete Account
          </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
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
      </Modal>
    )
  }

  if (showChangePassword) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          <h2 
            className="text-h3 font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Change Password
          </h2>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label 
                className="block text-body-normal font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                placeholder="Enter new password"
                minLength={6}
              />
            </div>

            <div>
              <label 
                className="block text-body-normal font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
          </div>

          <div className="flex gap-3">
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
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 
          className="text-h3 font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Privacy & Security
        </h2>
      <div className="space-y-4">
        <div className="space-y-3">
          <div 
            className="text-body-normal font-medium mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Security
          </div>
          
          <button
            onClick={() => setShowChangePassword(true)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Shield className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            <div className="text-left">
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
                Update your account password
              </div>
            </div>
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div 
            className="text-body-normal font-medium mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Data Management
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowDeleteDataConfirm(true)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <div className="text-left">
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
            </button>

            <button
              onClick={() => setShowDeleteAccountConfirm(true)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <div className="text-left">
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
            </button>
          </div>
        </div>
      </div>
      </div>
    </Modal>
  )
}