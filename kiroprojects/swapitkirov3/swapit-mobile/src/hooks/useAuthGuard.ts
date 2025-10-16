import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import { log } from '../config/environment';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  onAuthRequired?: () => void;
  onAuthSuccess?: () => void;
}

/**
 * Hook for implementing authentication guards in individual screens
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    redirectTo = '/(auth)/login',
    requireAuth = true,
    onAuthRequired,
    onAuthSuccess,
  } = options;

  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  // Check if user meets auth requirements
  const checkAuthRequirement = useCallback(() => {
    if (!isInitialized || isLoading) {
      return 'loading';
    }

    if (requireAuth && !isAuthenticated) {
      return 'auth_required';
    }

    if (!requireAuth && isAuthenticated) {
      return 'already_authenticated';
    }

    return 'authorized';
  }, [isAuthenticated, isLoading, isInitialized, requireAuth]);

  // Handle authentication requirement
  const handleAuthRequired = useCallback(() => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      log('AuthGuard: Redirecting to:', redirectTo);
      router.replace(redirectTo as any);
    }
  }, [onAuthRequired, redirectTo, router]);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  // Main auth guard effect
  useEffect(() => {
    const authStatus = checkAuthRequirement();

    switch (authStatus) {
      case 'auth_required':
        handleAuthRequired();
        break;
      case 'already_authenticated':
        if (!requireAuth) {
          // Redirect authenticated users away from guest-only pages
          router.replace('/(tabs)');
        }
        break;
      case 'authorized':
        handleAuthSuccess();
        break;
      case 'loading':
        // Do nothing while loading
        break;
    }
  }, [
    checkAuthRequirement,
    handleAuthRequired,
    handleAuthSuccess,
    requireAuth,
    router,
  ]);

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    authStatus: checkAuthRequirement(),
    canAccess: checkAuthRequirement() === 'authorized',
  };
};

/**
 * Hook specifically for protected routes that require authentication
 */
export const useRequireAuth = (redirectTo?: string) => {
  return useAuthGuard({
    requireAuth: true,
    ...(redirectTo && { redirectTo }),
  });
};

/**
 * Hook specifically for guest-only routes (login, signup, etc.)
 */
export const useRequireGuest = (redirectTo?: string) => {
  return useAuthGuard({
    requireAuth: false,
    ...(redirectTo && { redirectTo }),
  });
};