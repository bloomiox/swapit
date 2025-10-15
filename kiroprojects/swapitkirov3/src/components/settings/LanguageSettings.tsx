'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const languages = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' }
]

export function LanguageSettings() {
  const { currentLanguage, changeLanguage } = useLanguage()

  return (
    <div>
      <div className="mb-6">
        <h1 
          className="text-h3 font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Language
        </h1>
        <p 
          className="text-body-normal"
          style={{ color: 'var(--text-secondary)' }}
        >
          Choose your preferred language for the interface.
        </p>
      </div>

      <div className="space-y-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <div 
                  className="font-medium text-body-normal"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {language.name}
                </div>
                <div 
                  className="text-caption"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {language.code}
                </div>
              </div>
            </div>
            
            {currentLanguage === language.code && (
              <Check 
                className="w-5 h-5" 
                style={{ color: '#119C21' }}
              />
            )}
          </button>
        ))}
      </div>

      <div 
        className="mt-6 p-4 rounded-xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <p 
          className="text-caption"
          style={{ color: 'var(--text-secondary)' }}
        >
          <strong>Note:</strong> Language changes will take effect immediately. 
          Some content may still appear in English as translations are being completed.
        </p>
      </div>
    </div>
  )
}