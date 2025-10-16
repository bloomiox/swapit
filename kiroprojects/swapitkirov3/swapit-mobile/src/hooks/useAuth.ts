import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { refreshSession, getCurrentSession } from '../services/supabase';
import { log, logError } from '../config/environment';

// Token refresh interval (45 minutes - tokens expire after 1 hour)
const TOKEN_REFRESH_INTERVAL = 45 * 60 * 1000;
// Check session validity interval when app becomes active
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useAuth = () => {
  const router = useRouter();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSessionCheckRef = useRef<number>(0);
  
  const {
    user,
    session,
    isLoading,
    isAuthenticated,
    isInitialized,
    signIn,
    signUp,
    signOut,
    initialize,
    clearAuth,
    setSession,
  } = useAuthStore();

  // Enhanced sign out with cleanup
  const signOutWithCleanup = useCallback(async () => {
    try {
      // Clear refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      
      await signOut();
      
      // Navigate to auth screen
      router.replace('/(auth)/login');
      
      log('User signed out and redirected to login');
    } catch (error) {
      logError('Error during sign out:', error);
    }
  }, [signOut, router]);

  // Automatic token refresh
  const refreshToken = useCallback(async () => {
    try {
      if (!session) {
        log('No session available for token refresh');
        return;
      }

      // Check if token is close to expiring (within 15 minutes)
      const expiresAt = session.expires_at;
      if (!expiresAt) {
        log('No expiry time available for token refresh');
        return;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;
      
      if (timeUntilExpiry > 15 * 60) {
        log('Token still valid, skipping refresh');
        return;
      }

      log('Refreshing authentication token');
      
      const { data, error } = await refreshSession();
      
      if (error) {
        logError('Token refresh failed:', error);
        
        // If refresh fails, sign out user
        await signOutWithCleanup();
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        log('Token refreshed successfully');
      }
    } catch (error) {
      logError('Token refresh error:', error);
      await signOutWithCleanup();
    }
  }, [session, setSession, signOutWithCleanup]);

  // Check session validity
  const checkSessionValidity = useCallback(async () => {
    try {
      const now = Date.now();
      
      // Throttle session checks
      if (now - lastSessionCheckRef.current < SESSION_CHECK_INTERVAL) {
        return;
      }
      
      lastSessionCheckRef.current = now;
      
      if (!session) {
        return;
      }

      // Check if session is expired
      const expiresAt = session.expires_at;
      if (!expiresAt) {
        log('No expiry time available, signing out');
        await signOutWithCleanup();
        return;
      }
      
      const expiresAtMs = expiresAt * 1000; // Convert to milliseconds
      
      if (now >= expiresAtMs) {
        log('Session expired, attempting refresh');
        await refreshToken();
        return;
      }

      // Verify session with server
      const { data, error } = await getCurrentSession();
      
      if (error || !data.session) {
        log('Session invalid on server, signing out');
        await signOutWithCleanup();
        return;
      }
      
      // Update session if it changed
      if (data.session.access_token !== session.access_token) {
        setSession(data.session);
        log('Session updated from server');
      }
    } catch (error) {
      logError('Session validity check error:', error);
    }
  }, [session, refreshToken, signOutWithCleanup, setSession]);

  // Handle app state changes
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && isAuthenticated) {
      log('App became active, checking session validity');
      checkSessionValidity();
    }
  }, [isAuthenticated, checkSessionValidity]);

  // Set up automatic token refresh
  useEffect(() => {
    if (isAuthenticated && session) {
      // Clear existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      // Set up new refresh interval
      refreshIntervalRef.current = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
      
      log('Token refresh interval set up');
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    }
    
    // Return undefined for the else case
    return undefined;
  }, [isAuthenticated, session, refreshToken]);

  // Set up app state listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [handleAppStateChange]);

  // Initialize auth store
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Navigation helpers
  const requireAuth = useCallback(() => {
    if (!isAuthenticated && isInitialized) {
      router.replace('/(auth)/login');
      return false;
    }
    return true;
  }, [isAuthenticated, isInitialized, router]);

  const redirectIfAuthenticated = useCallback(() => {
    if (isAuthenticated && isInitialized) {
      router.replace('/(tabs)');
      return true;
    }
    return false;
  }, [isAuthenticated, isInitialized, router]);

  return {
    // State
    user,
    session,
    isLoading,
    isAuthenticated,
    isInitialized,
    
    // Actions
    signIn,
    signUp,
    signOut: signOutWithCleanup,
    clearAuth,
    refreshToken,
    checkSessionValidity,
    
    // Navigation helpers
    requireAuth,
    redirectIfAuthenticated,
  };
};