'use client'

import { Settings, Database, Mail, Bell } from 'lucide-react'

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          System Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure system-wide settings and preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-8">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">System Settings</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            System configuration options will be implemented here.
          </p>
        </div>
      </div>
    </div>
  )
}