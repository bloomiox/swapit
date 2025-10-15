'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { EmailConfirmationGuard } from '@/components/auth/EmailConfirmationGuard'
import { 
  SettingsSidebar,
  LanguageSettings,
  ThemeSettings,
  EmailSettings,
  PrivacySettings,
  AccountSettings
} from '@/components/settings'

export type SettingsSection = 'language' | 'theme' | 'email' | 'privacy' | 'account'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState<SettingsSection>('theme')

  useEffect(() => {
    const section = searchParams.get('section') as SettingsSection
    if (section && ['language', 'theme', 'email', 'privacy', 'account'].includes(section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  const renderContent = () => {
    switch (activeSection) {
      case 'language':
        return <LanguageSettings />
      case 'theme':
        return <ThemeSettings />
      case 'email':
        return <EmailSettings />
      case 'privacy':
        return <PrivacySettings />
      case 'account':
        return <AccountSettings />
      default:
        return <ThemeSettings />
    }
  }

  return (
    <ProtectedRoute>
      <EmailConfirmationGuard>
        <main className="min-h-screen px-2.5">
          <Navbar />
          <div 
            className="min-h-screen"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-6 lg:px-[165px] py-6">
              {/* Settings Sidebar */}
              <SettingsSidebar 
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
              
              {/* Settings Content */}
              <div className="flex-1">
                <div 
                  className="rounded-2xl border p-6"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </EmailConfirmationGuard>
    </ProtectedRoute>
  )
}