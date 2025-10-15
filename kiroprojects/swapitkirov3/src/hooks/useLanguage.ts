'use client'

import { useState, useEffect } from 'react'

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState('EN')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('swapIt_language')
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language)
    localStorage.setItem('swapIt_language', language)
    
    // Here you would typically trigger i18n language change
    // For now, we'll just store the preference
    console.log(`Language changed to: ${language}`)
  }

  return {
    currentLanguage,
    changeLanguage
  }
}