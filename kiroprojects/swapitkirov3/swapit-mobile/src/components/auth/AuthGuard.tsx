import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { log } from '../../config/environment';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Redirects to login if user is not authenticated
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  redirectTo = '/(auth)/login'
}) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated && !isLoading) {
      log('AuthGuard: User not authenticated, redirecting to:', redirectTo);
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

  // Show content if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show fallback while redirecting
  return fallback || (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};