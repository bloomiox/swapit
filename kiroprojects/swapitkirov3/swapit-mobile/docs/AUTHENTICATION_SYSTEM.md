# Authentication System Documentation

## Overview

The SwapIt mobile app implements a comprehensive authentication system with automatic token refresh, authentication guards, and secure session management. This system ensures users stay authenticated while providing security through automatic token refresh and proper session validation.

## Components

### 1. Enhanced useAuth Hook

The `useAuth` hook provides comprehensive authentication state management with automatic token refresh:

```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const {
    // State
    user,
    session,
    isLoading,
    isAuthenticated,
    isInitialized,
    
    // Actions
    signIn,
    signUp,
    signOut,
    refreshToken,
    checkSessionValidity,
    
    // Navigation helpers
    requireAuth,
    redirectIfAuthenticated,
  } = useAuth();

  // Use authentication state and actions
};
```

**Features:**
- Automatic token refresh every 45 minutes
- Session validation when app becomes active
- Automatic sign out on token refresh failure
- Navigation helpers for auth requirements

### 2. Authentication Guards

#### AuthGuard Component
Protects routes that require authentication:

```typescript
import { AuthGuard } from '../components/auth';

const ProtectedScreen = () => (
  <AuthGuard>
    <YourProtectedContent />
  </AuthGuard>
);
```

#### GuestGuard Component
Protects routes for unauthenticated users only:

```typescript
import { GuestGuard } from '../components/auth';

const LoginScreen = () => (
  <GuestGuard>
    <YourLoginForm />
  </GuestGuard>
);
```

#### ProtectedRoute Component
Conditionally renders content with optional login prompt:

```typescript
import { ProtectedRoute } from '../components/auth';

const OptionalAuthFeature = () => (
  <ProtectedRoute showLoginPrompt={true}>
    <YourFeatureContent />
  </ProtectedRoute>
);
```

### 3. Authentication Guard Hooks

#### useAuthGuard Hook
Flexible authentication guard for individual screens:

```typescript
import { useAuthGuard } from '../hooks/useAuthGuard';

const MyScreen = () => {
  const { canAccess, authStatus } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/(auth)/login',
    onAuthRequired: () => {
      // Custom handling when auth is required
    },
  });

  if (!canAccess) {
    return <LoadingScreen />;
  }

  return <YourContent />;
};
```

#### useRequireAuth Hook
Simplified hook for protected routes:

```typescript
import { useRequireAuth } from '../hooks/useAuthGuard';

const ProtectedScreen = () => {
  const { canAccess } = useRequireAuth();
  
  if (!canAccess) return null;
  
  return <YourContent />;
};
```

#### useRequireGuest Hook
Simplified hook for guest-only routes:

```typescript
import { useRequireGuest } from '../hooks/useAuthGuard';

const LoginScreen = () => {
  const { canAccess } = useRequireGuest();
  
  if (!canAccess) return null;
  
  return <YourLoginForm />;
};
```

### 4. Token Refresh Service

The `TokenRefreshService` handles automatic token refresh:

```typescript
import { tokenRefreshService, useTokenRefresh } from '../services/tokenRefresh';

// In a component
const MyComponent = () => {
  const {
    refreshTokenIfNeeded,
    forceRefresh,
    validateSession,
    getTimeUntilExpiry,
    isTokenExpiringSoon,
  } = useTokenRefresh();

  // Use token refresh functionality
};

// Manual control
tokenRefreshService.start(); // Start automatic refresh
tokenRefreshService.stop();  // Stop automatic refresh
```

**Features:**
- Automatic refresh 15 minutes before expiry
- App state change detection
- Session validation with server
- Configurable refresh intervals

### 5. Authentication Utilities

Utility functions for common authentication tasks:

```typescript
import {
  hasRole,
  isUserVerified,
  getUserDisplayName,
  getUserAvatarUrl,
  isSessionExpired,
  getTimeUntilExpiry,
  isSessionExpiringSoon,
  formatTimeUntilExpiry,
  getAuthStatus,
  validateAuthRequirements,
} from '../utils/auth';

// Check user roles
const isAdmin = hasRole(user, 'admin');

// Get user info
const displayName = getUserDisplayName(user);
const avatarUrl = getUserAvatarUrl(user);

// Check session status
const isExpired = isSessionExpired(session);
const timeLeft = formatTimeUntilExpiry(session);

// Validate auth requirements
const { isValid, reason } = validateAuthRequirements({
  requireAuth: true,
  requireVerification: true,
  requiredRoles: ['admin'],
});
```

## Implementation Examples

### 1. Protected Screen with Hook

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useRequireAuth } from '../hooks/useAuthGuard';

const ProfileScreen = () => {
  const { canAccess, isLoading } = useRequireAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!canAccess) {
    return null; // Will redirect to login
  }

  return (
    <View>
      <Text>Protected Profile Content</Text>
    </View>
  );
};
```

### 2. Layout with Authentication Guard

```typescript
import React from 'react';
import { Stack } from 'expo-router';
import { AuthGuard } from '../components/auth';

const ProtectedLayout = () => (
  <AuthGuard>
    <Stack>
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  </AuthGuard>
);
```

### 3. Optional Authentication Feature

```typescript
import React from 'react';
import { ProtectedRoute } from '../components/auth';
import { SaveItemButton } from '../components/SaveItemButton';

const ItemCard = ({ item }) => (
  <View>
    <Text>{item.title}</Text>
    <ProtectedRoute showLoginPrompt={false}>
      <SaveItemButton itemId={item.id} />
    </ProtectedRoute>
  </View>
);
```

### 4. Custom Authentication Logic

```typescript
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateAuthRequirements } from '../utils/auth';

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { isValid, reason } = validateAuthRequirements({
      requireAuth: true,
      requiredRoles: ['admin'],
    });

    if (!isValid) {
      console.log('Access denied:', reason);
      router.replace('/unauthorized');
    }
  }, [user, isAuthenticated]);

  return <AdminContent />;
};
```

## Configuration

### Token Refresh Settings

```typescript
// In tokenRefresh.ts
const REFRESH_INTERVAL = 45 * 60 * 1000; // 45 minutes
const TOKEN_EXPIRY_BUFFER = 15 * 60; // 15 minutes before expiry
const MIN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes minimum between attempts
```

### Authentication Store Configuration

The auth store automatically:
- Persists user session to AsyncStorage
- Sets up auth state change listeners
- Starts/stops token refresh service
- Handles authentication errors

## Security Features

1. **Automatic Token Refresh**: Tokens are refreshed automatically before expiry
2. **Session Validation**: Sessions are validated with the server when app becomes active
3. **Secure Storage**: Tokens are stored securely using Expo SecureStore
4. **Error Handling**: Failed refresh attempts result in automatic sign out
5. **App State Monitoring**: Authentication is checked when app becomes active
6. **Rate Limiting**: Token refresh attempts are rate limited to prevent abuse

## Best Practices

1. **Use Guards at Layout Level**: Apply `AuthGuard` or `GuestGuard` at layout level for entire sections
2. **Use Hooks for Individual Screens**: Use `useRequireAuth` or `useRequireGuest` for specific screen logic
3. **Handle Loading States**: Always handle loading states while authentication initializes
4. **Provide Fallbacks**: Provide appropriate fallback UI for authentication guards
5. **Monitor Token Expiry**: Use `useTokenRefresh` to monitor and handle token expiry
6. **Validate Permissions**: Use `validateAuthRequirements` for complex permission checks

## Troubleshooting

### Common Issues

1. **Infinite Redirects**: Ensure guards are not conflicting (don't use AuthGuard and GuestGuard together)
2. **Token Refresh Failures**: Check network connectivity and Supabase configuration
3. **Session Not Persisting**: Verify AsyncStorage permissions and Expo SecureStore setup
4. **Authentication State Not Updating**: Ensure auth store is properly initialized

### Debug Information

```typescript
import { getAuthStatus } from '../utils/auth';

// Get comprehensive auth status
const authStatus = getAuthStatus();
console.log('Auth Status:', authStatus);
```

This authentication system provides a robust, secure, and user-friendly authentication experience for the SwapIt mobile app.