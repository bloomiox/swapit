'use client'

import React from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const themeOptions = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface',
    icon: Sun
  },
  {
    id: 'dark', 
    name: 'Dark',
    description: 'Easy on the eyes in low light',
    icon: Moon
  },
  {
    id: 'system',
    name: 'System',
    description: 'Follow your device settings',
    icon: Monitor
  }
]

export function ThemeSettings() {
  const { theme, toggleTheme } = useTheme()

  const handleThemeChange = (selectedTheme: string) => {
    if (selectedTheme === 'system') {
      // Detect system preference and apply it
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      if (theme !== systemPreference) {
        toggleTheme()
      }
      // Note: In a full implementation, you'd want to listen for system changes
      // and update the theme automatically
    } else if (selectedTheme !== theme) {
      toggleTheme()
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 
          className="text-h3 font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Theme
        </h1>
        <p 
          className="text-body-normal"
          style={{ color: 'var(--text-secondary)' }}
        >
          Choose how SwapIt looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
        </p>
      </div>

      <div className="space-y-3">
        {themeOptions.map((option) => {
          const Icon = option.icon
          // For now, we only support light/dark directly
          // System option is shown but not fully implemented
          const isSelected = option.id === theme
          
          return (
            <button
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              disabled={option.id === 'system'} // Disable system option for now
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors border ${
                option.id === 'system' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: isSelected ? '#119C21' : 'var(--bg-secondary)',
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ 
                      color: isSelected ? 'white' : 'var(--text-secondary)' 
                    }}
                  />
                </div>
                <div className="text-left">
                  <div 
                    className="font-medium text-body-normal"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {option.name}
                  </div>
                  <div 
                    className="text-caption"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {option.description}
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <Check 
                  className="w-5 h-5" 
                  style={{ color: '#119C21' }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div 
        className="mt-6 p-4 rounded-xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="space-y-2">
          <p 
            className="text-caption"
            style={{ color: 'var(--text-secondary)' }}
          >
            <strong>Tip:</strong> Dark theme can help reduce eye strain in low-light environments and may help save battery on devices with OLED screens.
          </p>
          <p 
            className="text-caption"
            style={{ color: 'var(--text-secondary)' }}
          >
            <strong>Note:</strong> System theme option will automatically switch between light and dark based on your device settings (coming soon).
          </p>
        </div>
      </div>

      {/* Theme Preview Cards */}
      <div className="mt-6">
        <h3 
          className="text-h5 font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Preview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Light Theme Preview */}
          <div className="p-4 rounded-xl border bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Light</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-100 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Dark Theme Preview */}
          <div className="p-4 rounded-xl border bg-gray-900">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-white">Dark</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-700 rounded"></div>
              <div className="h-2 bg-gray-600 rounded w-3/4"></div>
              <div className="h-2 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}