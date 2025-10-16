// Environment configuration for different deployment environments

export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    environment: 'development' | 'staging' | 'production';
    version: string;
    buildNumber: string;
  };
  features: {
    enableAnalytics: boolean;
    enableCrashReporting: boolean;
    enablePushNotifications: boolean;
    enableBiometrics: boolean;
    enableOfflineMode: boolean;
  };
  api: {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  cache: {
    maxSize: number; // in MB
    ttl: number; // in milliseconds
  };
}

// Get current environment
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = process.env.EXPO_PUBLIC_APP_ENV;
  if (env === 'staging' || env === 'production') {
    return env;
  }
  return 'development';
};

// Base configuration
const baseConfig: Omit<EnvironmentConfig, 'supabase'> = {
  app: {
    environment: getEnvironment(),
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    buildNumber: process.env.EXPO_PUBLIC_BUILD_NUMBER || '1',
  },
  features: {
    enableAnalytics: getEnvironment() === 'production',
    enableCrashReporting: getEnvironment() !== 'development',
    enablePushNotifications: true,
    enableBiometrics: true,
    enableOfflineMode: true,
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  cache: {
    maxSize: 100, // 100 MB
    ttl: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Environment-specific configurations
const environmentConfigs: Record<string, Partial<EnvironmentConfig>> = {
  development: {
    features: {
      enableAnalytics: false,
      enableCrashReporting: false,
      enablePushNotifications: true,
      enableBiometrics: true,
      enableOfflineMode: true,
    },
    api: {
      timeout: 10000, // 10 seconds for faster development
      retryAttempts: 1,
      retryDelay: 500,
    },
  },
  staging: {
    features: {
      enableAnalytics: true,
      enableCrashReporting: true,
      enablePushNotifications: true,
      enableBiometrics: true,
      enableOfflineMode: true,
    },
  },
  production: {
    features: {
      enableAnalytics: true,
      enableCrashReporting: true,
      enablePushNotifications: true,
      enableBiometrics: true,
      enableOfflineMode: true,
    },
  },
};

// Create final configuration
const createConfig = (): EnvironmentConfig => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing required environment variables: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  const environment = getEnvironment();
  const envConfig = environmentConfigs[environment] || {};

  return {
    ...baseConfig,
    ...envConfig,
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    },
  };
};

export const config = createConfig();

// Helper functions
export const isDevelopment = () => config.app.environment === 'development';
export const isStaging = () => config.app.environment === 'staging';
export const isProduction = () => config.app.environment === 'production';

// Feature flags
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']) => {
  return config.features[feature];
};

// Logging helper
export const log = (...args: any[]) => {
  if (isDevelopment()) {
    console.log('[SwapIt Mobile]', ...args);
  }
};

export const logError = (...args: any[]) => {
  if (isDevelopment()) {
    console.error('[SwapIt Mobile Error]', ...args);
  }
};

export const logWarn = (...args: any[]) => {
  if (isDevelopment()) {
    console.warn('[SwapIt Mobile Warning]', ...args);
  }
};