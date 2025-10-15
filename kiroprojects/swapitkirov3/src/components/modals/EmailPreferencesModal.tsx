'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface EmailPreferencesModalProps {
  isOpen: boolean
  onClose: () => void
}

interface EmailPreferences {
  swapRequests: boolean
  notifications: boolean
  all: boolean
}

export function EmailPreferencesModal({
  isOpen,
  onClose
}: EmailPreferencesModalProps) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<EmailPreferences>({
    swapRequests: true,
    notifications: true,
    all: true
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      loadPreferences()
    }
  }, [isOpen, user])

  const loadPreferences = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('notification_preferences')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading email preferences:', error)
        return
      }

      if (data?.notification_preferences?.email) {
        setPreferences(data.notification_preferences.email)
      }
    } catch (error) {
      console.error('Error loading email preferences:', error)
    } finally {
      setLoading(false)
    }
  } 
 const savePreferences = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notification_preferences: {
            email: preferences
          },
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving email preferences:', error)
        return
      }

      onClose()
    } catch (error) {
      console.error('Error saving email preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = (key: keyof EmailPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleAll = () => {
    const newAllState = !preferences.all
    setPreferences({
      swapRequests: newAllState,
      notifications: newAllState,
      all: newAllState
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 
          className="text-h3 font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Email Preferences
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div>
                  <div 
                    className="font-medium text-body-normal"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    All Email Notifications
                  </div>
                  <div 
                    className="text-caption mt-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Enable or disable all email notifications
                  </div>
                </div>
                <button
                  onClick={toggleAll}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.all ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.all ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div>
                    <div 
                      className="font-medium text-body-normal"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Swap Requests
                    </div>
                    <div 
                      className="text-caption mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Get notified when someone wants to swap with you
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('swapRequests')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.swapRequests ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.swapRequests ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div>
                    <div 
                      className="font-medium text-body-normal"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      General Notifications
                    </div>
                    <div 
                      className="text-caption mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Updates about your items, messages, and reviews
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={savePreferences}
                className="flex-1"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}