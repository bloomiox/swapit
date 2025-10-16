import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { log } from '../../config/environment';

interface GuestGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * GuestGuard component that protects routes for unauthenticated users only
 * Redirects to main app if user is already authenticated
 */
export const GuestGuard: React.FC<GuestGuardProps> = ({ 
  children, 
  fallback,
  redirectTo = '/(tabs)'
}) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated && !isLoading) {
      log('GuestGuard: User already authenticated, redirecting to:', redirectTo);
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, redirectTo]);

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
    return fallback || (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show content if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Show fallback while redirecting
  return fallback || (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};