'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  const handleClick = () => {
    console.log('ThemeSwitcher clicked, current theme:', theme)
    toggleTheme()
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-lg border hover:opacity-80 transition-all duration-200"
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        borderColor: 'var(--border-color)'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative w-5 h-5">
        <SunIcon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`}
          style={{ color: 'var(--text-primary)' }}
        />
        <MoonIcon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`}
          style={{ color: 'var(--text-primary)' }}
        />
      </div>
    </button>
  )
}