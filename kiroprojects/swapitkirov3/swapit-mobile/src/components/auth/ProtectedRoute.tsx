import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoginPrompt?: boolean;
}

/**
 * ProtectedRoute component that conditionally renders content based on auth state
 * Shows login prompt instead of redirecting (useful for optional auth features)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  showLoginPrompt = true
}) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
    return fallback || (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ color: '#6B7280' }}>Loading...</Text>
      </View>
    );
  }

  // Show content if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show login prompt if not authenticated
  if (showLoginPrompt) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
          Sign in Required
        </Text>
        <Text style={{ color: '#6B7280', marginBottom: 24, textAlign: 'center' }}>
          You need to sign in to access this feature
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={{ backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show custom fallback
  return fallback || null;
};