'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface EmailPreferences {
  swapRequests: boolean
  notifications: boolean
  all: boolean
}

export function EmailSettings() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<EmailPreferences>({
    swapRequests: true,
    notifications: true,
    all: true
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      loadPreferences()
    }
  }, [user])

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

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          Email Preferences
        </h1>
        <p 
          className="text-body-normal"
          style={{ color: 'var(--text-secondary)' }}
        >
          Choose which email notifications you'd like to receive.
        </p>
      </div>

      <div className="space-y-6">
        {/* Master Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border"
             style={{ borderColor: 'var(--border-color)' }}>
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
              Enable or disable all email notifications at once
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

        {/* Individual Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border"
               style={{ borderColor: 'var(--border-color)' }}>
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

          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border"
               style={{ borderColor: 'var(--border-color)' }}>
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

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={savePreferences}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}