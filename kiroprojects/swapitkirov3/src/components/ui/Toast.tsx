'use client'

import React, { useEffect, useState } from 'react'
import { X, MessageCircle } from 'lucide-react'

export interface ToastProps {
  id: string
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, title, message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#D8F7D7',
          borderColor: '#119C21',
          iconColor: '#119C21'
        }
      case 'warning':
        return {
          backgroundColor: '#FFF3CD',
          borderColor: '#856404',
          iconColor: '#856404'
        }
      case 'error':
        return {
          backgroundColor: '#FDE1E0',
          borderColor: '#7C0D09',
          iconColor: '#7C0D09'
        }
      default:
        return {
          backgroundColor: '#E9F1FD',
          borderColor: '#0066CC',
          iconColor: '#0066CC'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-2xl border shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor
      }}
    >
      <div className="flex items-start gap-3">
        <MessageCircle 
          className="w-5 h-5 flex-shrink-0 mt-0.5" 
          style={{ color: styles.iconColor }} 
        />
        <div className="flex-1 min-w-0">
          <h4 
            className="text-body-small-bold font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h4>
          <p 
            className="text-body-small mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
          }}
          className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </div>
  )
}

export interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}