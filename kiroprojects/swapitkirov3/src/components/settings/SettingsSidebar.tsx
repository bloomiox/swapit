'use client'

import React from 'react'
import { Globe, Palette, Mail, Shield, User } from 'lucide-react'
import type { SettingsSection } from '@/app/settings/page'

interface SettingsSidebarProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

const settingsItems = [
  {
    id: 'language' as SettingsSection,
    label: 'Language',
    icon: Globe,
    description: 'Change your language preference'
  },
  {
    id: 'theme' as SettingsSection,
    label: 'Theme',
    icon: Palette,
    description: 'Switch between light and dark mode'
  },
  {
    id: 'email' as SettingsSection,
    label: 'Email Preferences',
    icon: Mail,
    description: 'Manage email notifications'
  },
  {
    id: 'privacy' as SettingsSection,
    label: 'Privacy & Security',
    icon: Shield,
    description: 'Data and security settings'
  },
  {
    id: 'account' as SettingsSection,
    label: 'Account',
    icon: User,
    description: 'Account management'
  }
]

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div 
      className="w-full lg:w-[300px] rounded-2xl border p-4"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)'
      }}
    >
      <h2 
        className="text-h4 font-bold mb-6"
        style={{ color: 'var(--text-primary)' }}
      >
        Settings
      </h2>
      
      <nav className="space-y-2">
        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon 
                className="w-5 h-5 mt-0.5 flex-shrink-0" 
                style={{ 
                  color: isActive ? '#119C21' : 'var(--text-secondary)' 
                }}
                strokeWidth={1.5}
              />
              <div className="flex-1 min-w-0">
                <div 
                  className={`font-medium text-body-normal ${
                    isActive ? 'text-primary' : ''
                  }`}
                  style={{ 
                    color: isActive ? '#119C21' : 'var(--text-primary)' 
                  }}
                >
                  {item.label}
                </div>
                <div 
                  className="text-caption mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.description}
                </div>
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}