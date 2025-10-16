import { User, Session } from '@supabase/supabase-js';
import { useAuthStore } from '../stores/authStore';
import { log } from '../config/environment';

/**
 * Authentication utility functions
 */

/**
 * Check if user has a specific role or permission
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  
  const userRoles = user.user_metadata?.roles || [];
  return userRoles.includes(role);
};

/**
 * Check if user is verified
 */
export const isUserVerified = (user: User | null): boolean => {
  if (!user) return false;
  
  return !!user.email_confirmed_at;
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  
  return (
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    user.email ||
    'User'
  );
};

/**
 * Get user avatar URL
 */
export const getUserAvatarUrl = (user: User | null): string | null => {
  if (!user) return null;
  
  return (
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null
  );
};

/**
 * Check if session is expired
 */
export const isSessionExpired = (session: Session | null): boolean => {
  if (!session || !session.expires_at) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return now >= session.expires_at;
};

/**
 * Get time until session expires (in seconds)
 */
export const getTimeUntilExpiry = (session: Session | null): number => {
  if (!session || !session.expires_at) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, session.expires_at - now);
};

/**
 * Check if session will expire soon (within 15 minutes)
 */
export const isSessionExpiringSoon = (session: Session | null): boolean => {
  const timeUntilExpiry = getTimeUntilExpiry(session);
  return timeUntilExpiry <= 15 * 60; // 15 minutes
};

/**
 * Format time until expiry as human readable string
 */
export const formatTimeUntilExpiry = (session: Session | null): string => {
  const seconds = getTimeUntilExpiry(session);
  
  if (seconds <= 0) return 'Expired';
  
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  
  return `${minutes}m`;
};

/**
 * Get authentication status summary
 */
export const getAuthStatus = () => {
  const { user, session, isAuthenticated, isLoading, isInitialized } = useAuthStore.getState();
  
  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    isVerified: isUserVerified(user),
    isExpired: isSessionExpired(session),
    isExpiringSoon: isSessionExpiringSoon(session),
    timeUntilExpiry: getTimeUntilExpiry(session),
    displayName: getUserDisplayName(user),
    avatarUrl: getUserAvatarUrl(user),
  };
};

/**
 * Validate authentication requirements for a route
 */
export const validateAuthRequirements = (requirements: {
  requireAuth?: boolean;
  requireVerification?: boolean;
  requiredRoles?: string[];
}): {
  isValid: boolean;
  reason?: string;
} => {
  const { user, isAuthenticated } = useAuthStore.getState();
  const { requireAuth = true, requireVerification = false, requiredRoles = [] } = requirements;
  
  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return { isValid: false, reason: 'Authentication required' };
  }
  
  if (!requireAuth && isAuthenticated) {
    return { isValid: false, reason: 'Guest access only' };
  }
  
  // Check verification requirement
  if (requireVerification && !isUserVerified(user)) {
    return { isValid: false, reason: 'Email verification required' };
  }
  
  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(user, role));
    if (!hasRequiredRole) {
      return { isValid: false, reason: 'Insufficient permissions' };
    }
  }
  
  return { isValid: true };
};

/**
 * Create authentication event logger
 */
export const createAuthLogger = (context: string) => {
  return {
    logSignIn: (userId: string) => {
      log(`${context}: User signed in - ${userId}`);
    },
    logSignOut: (userId?: string) => {
      log(`${context}: User signed out - ${userId || 'unknown'}`);
    },
    logTokenRefresh: (userId: string) => {
      log(`${context}: Token refreshed - ${userId}`);
    },
    logAuthError: (error: any, action: string) => {
      log(`${context}: Auth error during ${action}:`, error);
    },
  };
};

/**
 * Authentication constants
 */
export const AUTH_CONSTANTS = {
  TOKEN_REFRESH_INTERVAL: 45 * 60 * 1000, // 45 minutes
  TOKEN_EXPIRY_BUFFER: 15 * 60, // 15 minutes
  SESSION_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;