// App constants
export const APP_NAME = 'SwapIt';
export const APP_VERSION = '1.0.0';

// API constants
export const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const API_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CACHED_ITEMS: 'cached_items',
  QUEUED_ACTIONS: 'queued_actions',
} as const;

// Theme constants
export const THEME = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#10B981',
    ACCENT: '#F59E0B',
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F9FAFB',
    TEXT: '#111827',
    TEXT_SECONDARY: '#6B7280',
    BORDER: '#E5E7EB',
    ERROR: '#EF4444',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    FULL: 9999,
  },
} as const;

// Screen dimensions
export const SCREEN = {
  HEADER_HEIGHT: 56,
  TAB_BAR_HEIGHT: 60,
  SAFE_AREA_PADDING: 20,
} as const;