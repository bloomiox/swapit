'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Globe, 
  Mail, 
  Shield, 
  LogOut, 
  ChevronRight 
} from 'lucide-react'

interface ProfileSubmenuProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  className?: string
}

export function ProfileSubmenu({ 
  isOpen, 
  onClose, 
  onLogout, 
  className = '' 
}: ProfileSubmenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const menuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      onClick: () => {
        router.push('/profile')
        onClose()
      },
      showArrow: true
    },
    {
      id: 'language',
      label: 'Language',
      icon: Globe,
      onClick: () => {
        console.log('Open language settings')
        onClose()
      },
      showArrow: true,
      rightText: 'ENG'
    },
    {
      id: 'email',
      label: 'Email Preferences',
      icon: Mail,
      onClick: () => {
        console.log('Open email preferences')
        onClose()
      },
      showArrow: true
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: Shield,
      onClick: () => {
        console.log('Open privacy settings')
        onClose()
      },
      showArrow: true
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      onClick: () => {
        onLogout()
        onClose()
      },
      showArrow: true
    }
  ]

  return (
    <>
      {/* Menu */}
      <div 
        ref={menuRef}
        className={`absolute right-0 top-full mt-2 w-[390px] rounded-3xl border ${className}`}
        style={{
          zIndex: 9999,
          backgroundColor: 'var(--bg-primary)',
          boxShadow: '0px 16px 40px 0px rgba(23, 34, 99, 0.4)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 px-4 py-3 hover:opacity-80 transition-opacity"
              >
                {/* Left Icon */}
                <div className="flex items-center justify-center w-6 h-6">
                  <Icon 
                    className="w-6 h-6" 
                    strokeWidth={1.5}
                    style={{ color: item.id === 'logout' ? '#FD5F59' : 'var(--text-primary)' }}
                  />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 text-left">
                  <span 
                    className="text-body-normal font-medium"
                    style={{ color: item.id === 'logout' ? '#FD5F59' : 'var(--text-primary)' }}
                  >
                    {item.label}
                  </span>
                </div>
                
                {/* Right Content */}
                <div className="flex items-center gap-2">
                  {item.rightText && (
                    <span 
                      className="text-caption"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.rightText}
                    </span>
                  )}
                  {item.showArrow && (
                    <ChevronRight 
                      className="w-6 h-6" 
                      strokeWidth={1.5}
                      style={{ color: 'var(--text-primary)' }}
                    />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}