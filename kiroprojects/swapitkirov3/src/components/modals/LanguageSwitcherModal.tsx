'use client'

import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Check } from 'lucide-react'

interface LanguageSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

const languages = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' }
]

export function LanguageSwitcherModal({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange
}: LanguageSwitcherModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage)

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    onLanguageChange(languageCode)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 
          className="text-h3 font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Language
        </h2>
      <div className="space-y-2">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
            
            {selectedLanguage === language.code && (
              <Check 
                className="w-5 h-5" 
                style={{ color: 'var(--primary-color)' }}
              />
            )}
          </button>
        ))}
      </div>
      </div>
    </Modal>
  )
}