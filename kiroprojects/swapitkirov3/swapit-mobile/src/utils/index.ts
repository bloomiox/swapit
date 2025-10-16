// Utility functions
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Format date to human readable string
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

/**
 * Format time to human readable string
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString();
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Deep link utilities
 */
export interface DeepLinkData {
  screen?: string;
  params?: Record<string, any>;
}

/**
 * Parse deep link URL and extract navigation data
 */
export const parseDeepLink = (url: string): DeepLinkData | null => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    // Handle different deep link patterns
    if (pathSegments.length === 0) {
      return { screen: 'discover' };
    }
    
    const [firstSegment, ...rest] = pathSegments;
    
    switch (firstSegment) {
      case 'item':
        if (rest[0]) {
          return {
            screen: 'item',
            params: { id: rest[0] }
          };
        }
        break;
      case 'user':
        if (rest[0]) {
          return {
            screen: 'user',
            params: { id: rest[0] }
          };
        }
        break;
      case 'chat':
        if (rest[0]) {
          return {
            screen: 'chat',
            params: { id: rest[0] }
          };
        }
        break;
      case 'discover':
        return {
          screen: 'discover',
          params: Object.fromEntries(urlObj.searchParams.entries())
        };
      default:
        return { screen: 'discover' };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};

/**
 * Store deep link data for processing after app initialization
 */
export const storeDeepLinkData = async (data: DeepLinkData): Promise<void> => {
  try {
    await AsyncStorage.setItem('pending_deep_link', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing deep link data:', error);
  }
};

/**
 * Retrieve and clear stored deep link data
 */
export const getAndClearDeepLinkData = async (): Promise<DeepLinkData | null> => {
  try {
    const data = await AsyncStorage.getItem('pending_deep_link');
    if (data) {
      await AsyncStorage.removeItem('pending_deep_link');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving deep link data:', error);
    return null;
  }
};
/**

 * Validation utilities
 */

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Get user-friendly error message from Supabase error
 */
export const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';
  
  const message = error.message || error.error_description || '';
  
  // Common Supabase auth error messages
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }
  
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  
  if (message.includes('Unable to validate email address')) {
    return 'Please enter a valid email address.';
  }
  
  if (message.includes('Network error') || message.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (message.includes('Too many requests')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  
  // Return the original message if we don't have a specific mapping
  return message || 'An unexpected error occurred. Please try again.';
};