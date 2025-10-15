'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useAuthModals } from '@/hooks/useAuthModals'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
  showLoginPrompt?: boolean
}

export function AuthGuard({ 
  children, 
  fallback,
  requireAuth = false,
  showLoginPrompt = true
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const { openLogin } = useAuthModals()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // If auth is required and user is not authenticated
  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>
    }

    if (showLoginPrompt) {
      return (
        <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Login Required
          </h3>
          <p className="text-gray-600 mb-4">
            You need to be logged in to access this feature.
          </p>
          <button
            onClick={openLogin}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Login to Continue
          </button>
        </div>
      )
    }

    return null
  }

  // Render children (user is authenticated or auth not required)
  return <>{children}</>
}

// Hook for checking auth status in components
export function useAuthGuard() {
  const { user, loading } = useAuth()
  const { openLogin } = useAuthModals()

  const requireAuth = (callback?: () => void) => {
    if (loading) return false
    
    if (!user) {
      openLogin()
      return false
    }

    if (callback) callback()
    return true
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    requireAuth
  }
}