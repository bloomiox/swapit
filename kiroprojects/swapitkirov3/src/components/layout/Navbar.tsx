'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Link } from '@/components/ui/Link'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'
import { LoginModal } from '@/components/modals/LoginModal'
import { SignUpModal } from '@/components/modals/SignUpModal'
import { OnboardingModal } from '@/components/modals/OnboardingModal'
import { ProfileSubmenu } from '@/components/ui/ProfileSubmenu'
import { NotificationsPanel } from '@/components/ui/NotificationsPanel'
import { AddItemModal } from '@/components/modals/AddItemModal'
import { useAuthModals } from '@/hooks/useAuthModals'
import NextLink from 'next/link'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const pathname = usePathname()
  const { isLoginOpen, isSignUpOpen, isOnboardingOpen, openLogin, openSignUp, openOnboarding, closeAll } = useAuthModals()
  
  // Mock authentication state - in a real app, this would come from your auth context/provider
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsProfileMenuOpen(false)
    setIsNotificationsOpen(false)
    setIsAddItemOpen(false)
    // Add logout logic here
    console.log('User logged out')
  }

  return (
    <nav 
      className="sticky top-0 z-50 border-b"
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-[165px] py-5">
        {/* Logo */}
        <NextLink 
          href="/" 
          className="text-h4 font-bold hover:opacity-80 transition-opacity text-primary"
        >
          SwapIt
        </NextLink>
        
        {/* Demo Auth Toggle - Remove in production */}
        <button
          onClick={() => {
            setIsAuthenticated(!isAuthenticated)
            setIsProfileMenuOpen(false)
            setIsNotificationsOpen(false)
            setIsAddItemOpen(false)
          }}
          className="absolute top-2 right-2 px-2 py-1 text-xs border rounded-lg hover:opacity-80 transition-opacity z-10"
          style={{ 
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          Demo: {isAuthenticated ? 'Auth' : 'Guest'}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {isAuthenticated ? (
            /* Authenticated Navigation */
            <>
              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                {pathname === '/browse' ? (
                  <span className="text-primary">
                    Browse
                  </span>
                ) : (
                  <Link href="/browse" variant="default">
                    Browse
                  </Link>
                )}
                {pathname === '/requests' ? (
                  <span className="text-primary">
                    Requests
                  </span>
                ) : (
                  <Link href="/requests" variant="default">
                    Requests
                  </Link>
                )}
                {/* Chat with Badge */}
                <div className="relative flex items-center gap-1">
                  {pathname === '/chat' ? (
                    <span className="text-primary">
                      Chat
                    </span>
                  ) : (
                    <Link href="/chat" variant="default">
                      Chat
                    </Link>
                  )}
                  {/* Chat Badge */}
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </div>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {/* Notifications Icon Button */}
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="w-10 h-10 flex items-center justify-center border rounded-xl hover:opacity-80 transition-opacity"
                    style={{ 
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                  >
                    <Bell className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                    {/* Notification Badge */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">3</span>
                    </div>
                  </button>
                  
                  <NotificationsPanel
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                  />
                </div>

                {/* Avatar with Initials */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-caption-bold text-primary hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: '#D8F7D7' }}
                  >
                    JD
                  </button>
                  
                  <ProfileSubmenu
                    isOpen={isProfileMenuOpen}
                    onClose={() => setIsProfileMenuOpen(false)}
                    onLogout={handleLogout}
                  />
                </div>

                {/* Add Item Button */}
                <Button 
                  variant="primary" 
                  size="default" 
                  className="flex items-center gap-2"
                  onClick={() => setIsAddItemOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
            </>
          ) : (
            /* Unauthenticated Navigation */
            <>
              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                {pathname === '/browse' ? (
                  <span className="text-primary">
                    Browse
                  </span>
                ) : (
                  <Link href="/browse" variant="default">
                    Browse
                  </Link>
                )}
                {pathname === '/about' ? (
                  <span className="text-primary">
                    About
                  </span>
                ) : (
                  <Link href="/about" variant="default">
                    About
                  </Link>
                )}
                {pathname === '/contact' ? (
                  <span className="text-primary">
                    Contact
                  </span>
                ) : (
                  <Link href="/contact" variant="default">
                    Contact
                  </Link>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <ThemeSwitcher />

                {/* Auth Buttons */}
                <Button variant="secondary" size="default" onClick={openLogin}>
                  Login
                </Button>
                <Button variant="primary" size="default" onClick={openSignUp}>
                  Get Started
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 border rounded-xl hover:opacity-80 transition-all"
          style={{ 
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-primary)'
          }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          ) : (
            <Menu className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="lg:hidden border-t"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="px-4 py-4 space-y-4">
            {isAuthenticated ? (
              /* Authenticated Mobile Menu */
              <>
                {/* Navigation Links */}
                <div className="flex flex-col space-y-3">
                  {pathname === '/browse' ? (
                    <span className="py-2 text-primary">
                      Browse
                    </span>
                  ) : (
                    <Link href="/browse" variant="default" className="py-2">
                      Browse
                    </Link>
                  )}
                  {pathname === '/requests' ? (
                    <span className="py-2 text-primary">
                      Requests
                    </span>
                  ) : (
                    <Link href="/requests" variant="default" className="py-2">
                      Requests
                    </Link>
                  )}
                  {/* Chat with Badge */}
                  <div className="flex items-center gap-2 py-2">
                    {pathname === '/chat' ? (
                      <span className="text-primary">
                        Chat
                      </span>
                    ) : (
                      <Link href="/chat" variant="default">
                        Chat
                      </Link>
                    )}
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">3</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 py-3 border-t border-general-stroke dark:border-dark-stroke">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-caption-bold text-primary"
                    style={{ backgroundColor: '#D8F7D7' }}
                  >
                    JD
                  </div>
                  <div>
                    <div className="text-body-small-bold" style={{ color: 'var(--text-primary)' }}>
                      John Doe
                    </div>
                    <div className="text-body-small" style={{ color: 'var(--text-secondary)' }}>
                      john.doe@example.com
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="primary" 
                    size="default" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setIsAddItemOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                  
                  <NextLink href="/notifications">
                    <Button variant="outlined" size="default" className="w-full flex items-center justify-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </Button>
                  </NextLink>
                  
                  <Button variant="secondary" size="default" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              /* Unauthenticated Mobile Menu */
              <>
                {/* Navigation Links */}
                <div className="flex flex-col space-y-3">
                  {pathname === '/browse' ? (
                    <span className="py-2 text-primary">
                      Browse
                    </span>
                  ) : (
                    <Link href="/browse" variant="default" className="py-2">
                      Browse
                    </Link>
                  )}
                  {pathname === '/about' ? (
                    <span className="py-2 text-primary">
                      About
                    </span>
                  ) : (
                    <Link href="/about" variant="default" className="py-2">
                      About
                    </Link>
                  )}
                  {pathname === '/contact' ? (
                    <span className="py-2 text-primary">
                      Contact
                    </span>
                  ) : (
                    <Link href="/contact" variant="default" className="py-2">
                      Contact
                    </Link>
                  )}
                </div>

                {/* Theme Switcher */}
                <div className="flex justify-center pt-2">
                  <ThemeSwitcher />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-general-stroke dark:border-dark-stroke">
                  <Button variant="secondary" size="default" className="w-full" onClick={openLogin}>
                    Login
                  </Button>
                  <Button variant="primary" size="default" className="w-full" onClick={openSignUp}>
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeAll} 
        onSwitchToSignup={openSignUp} 
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={closeAll} 
        onSwitchToLogin={openLogin}
        onSignUpSuccess={openOnboarding}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={closeAll}
        onComplete={closeAll}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSuccess={(itemId, itemTitle) => {
          console.log('Item added successfully:', { itemId, itemTitle })
          // Could show a success toast here or update some global state
        }}
      />
    </nav>
  )
}