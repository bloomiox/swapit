import { AppState, AppStateStatus } from 'react-native';
import { refreshSession, getCurrentSession } from './supabase';
import { log, logError } from '../config/environment';
import type { Session } from '@supabase/supabase-js';

class TokenRefreshService {
  private refreshInterval: NodeJS.Timeout | null = null;
  private appStateSubscription: any = null;
  private lastRefreshAttempt: number = 0;
  private isRefreshing: boolean = false;
  private getAuthState: (() => { session: Session | null; isAuthenticated: boolean }) | null = null;
  private setSession: ((session: Session | null) => void) | null = null;
  private clearAuth: (() => void) | null = null;

  // Configuration
  private readonly REFRESH_INTERVAL = 45 * 60 * 1000; // 45 minutes
  private readonly MIN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes minimum between attempts
  private readonly TOKEN_EXPIRY_BUFFER = 15 * 60; // 15 minutes before expiry

  /**
   * Initialize the service with auth store callbacks
   */
  initialize(callbacks: {
    getAuthState: () => { session: Session | null; isAuthenticated: boolean };
    setSession: (session: Session | null) => void;
    clearAuth: () => void;
  }) {
    this.getAuthState = callbacks.getAuthState;
    this.setSession = callbacks.setSession;
    this.clearAuth = callbacks.clearAuth;
  }

  /**
   * Start the token refresh service
   */
  start() {
    this.stop(); // Clean up any existing intervals
    
    if (!this.getAuthState) {
      log('TokenRefreshService: Not initialized');
      return;
    }
    
    const { session, isAuthenticated } = this.getAuthState();
    
    if (!isAuthenticated || !session) {
      log('TokenRefreshService: Not starting - user not authenticated');
      return;
    }

    // Set up periodic refresh
    this.refreshInterval = setInterval(() => {
      this.refreshTokenIfNeeded();
    }, this.REFRESH_INTERVAL);

    // Set up app state listener
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

    log('TokenRefreshService: Started');
  }

  /**
   * Stop the token refresh service
   */
  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    log('TokenRefreshService: Stopped');
  }

  /**
   * Handle app state changes
   */
  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      log('TokenRefreshService: App became active, checking token');
      this.refreshTokenIfNeeded();
    }
  };

  /**
   * Check if token needs refresh and refresh if necessary
   */
  async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const now = Date.now();
      
      // Prevent too frequent refresh attempts
      if (now - this.lastRefreshAttempt < this.MIN_REFRESH_INTERVAL) {
        log('TokenRefreshService: Skipping refresh - too soon since last attempt');
        return false;
      }

      if (this.isRefreshing) {
        log('TokenRefreshService: Already refreshing token');
        return false;
      }

      if (!this.getAuthState) {
        log('TokenRefreshService: Not initialized');
        return false;
      }

      const { session, isAuthenticated } = this.getAuthState();
      
      if (!isAuthenticated || !session) {
        log('TokenRefreshService: No session to refresh');
        return false;
      }

      // Check if token is close to expiring
      const expiresAt = session.expires_at;
      if (!expiresAt) {
        log('TokenRefreshService: No expiry time available');
        return false;
      }
      
      const currentTime = Math.floor(now / 1000);
      const timeUntilExpiry = expiresAt - currentTime;

      if (timeUntilExpiry > this.TOKEN_EXPIRY_BUFFER) {
        log(`TokenRefreshService: Token still valid for ${Math.floor(timeUntilExpiry / 60)} minutes`);
        return false;
      }

      log('TokenRefreshService: Token needs refresh');
      return await this.performTokenRefresh();
    } catch (error) {
      logError('TokenRefreshService: Error checking token:', error);
      return false;
    }
  }

  /**
   * Force refresh the token
   */
  async forceRefresh(): Promise<boolean> {
    log('TokenRefreshService: Force refreshing token');
    return await this.performTokenRefresh();
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<boolean> {
    try {
      this.isRefreshing = true;
      this.lastRefreshAttempt = Date.now();

      const { data, error } = await refreshSession();

      if (error) {
        logError('TokenRefreshService: Refresh failed:', error);
        
        // If refresh fails, check if session is still valid
        const { data: sessionData, error: sessionError } = await getCurrentSession();
        
        if (sessionError || !sessionData.session) {
          log('TokenRefreshService: Session invalid, signing out user');
          if (this.clearAuth) {
            this.clearAuth();
          }
          return false;
        }
        
        return false;
      }

      if (data.session && this.setSession) {
        this.setSession(data.session);
        log('TokenRefreshService: Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      logError('TokenRefreshService: Refresh error:', error);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Validate current session with server
   */
  async validateSession(): Promise<boolean> {
    try {
      if (!this.getAuthState) {
        return false;
      }

      const { session } = this.getAuthState();
      
      if (!session) {
        return false;
      }

      // Check local expiry first
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at;
      
      if (!expiresAt) {
        log('TokenRefreshService: No expiry time available');
        return false;
      }
      
      if (now >= expiresAt) {
        log('TokenRefreshService: Session expired locally');
        return false;
      }

      // Validate with server
      const { data, error } = await getCurrentSession();
      
      if (error || !data.session) {
        log('TokenRefreshService: Session invalid on server');
        return false;
      }

      // Update session if it changed
      if (data.session.access_token !== session.access_token && this.setSession) {
        this.setSession(data.session);
        log('TokenRefreshService: Session updated from server');
      }

      return true;
    } catch (error) {
      logError('TokenRefreshService: Session validation error:', error);
      return false;
    }
  }

  /**
   * Get time until token expires (in seconds)
   */
  getTimeUntilExpiry(): number {
    if (!this.getAuthState) {
      return 0;
    }

    const { session } = this.getAuthState();
    
    if (!session || !session.expires_at) {
      return 0;
    }

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, session.expires_at - now);
  }

  /**
   * Check if token will expire soon
   */
  isTokenExpiringSoon(): boolean {
    return this.getTimeUntilExpiry() <= this.TOKEN_EXPIRY_BUFFER;
  }
}

// Create singleton instance
export const tokenRefreshService = new TokenRefreshService();

// Hook for using token refresh service in components
export const useTokenRefresh = () => {
  return {
    refreshTokenIfNeeded: () => tokenRefreshService.refreshTokenIfNeeded(),
    forceRefresh: () => tokenRefreshService.forceRefresh(),
    validateSession: () => tokenRefreshService.validateSession(),
    getTimeUntilExpiry: () => tokenRefreshService.getTimeUntilExpiry(),
    isTokenExpiringSoon: () => tokenRefreshService.isTokenExpiringSoon(),
  };
};