import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Database types will be added once schema is finalized
import { config, log, logError } from '../config/environment';

// Create Supabase client with React Native specific configuration
export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // React Native specific settings
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'swapit-mobile',
    },
  },
  realtime: {
    // Optimize for mobile connections
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helpers with enhanced error handling
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    
    if (error) {
      logError('Sign in error:', error);
    }
    
    return { data, error };
  } catch (error) {
    logError('Sign in exception:', error);
    return { 
      data: null, 
      error: { message: 'Network error. Please check your connection and try again.' } 
    };
  }
};

export const signUp = async (email: string, password: string, userData?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: userData || {},
      },
    });
    
    if (error) {
      logError('Sign up error:', error);
    }
    
    return { data, error };
  } catch (error) {
    logError('Sign up exception:', error);
    return { 
      data: null, 
      error: { message: 'Network error. Please check your connection and try again.' } 
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logError('Sign out error:', error);
    }
    
    return { error };
  } catch (error) {
    logError('Sign out exception:', error);
    return { error: { message: 'Failed to sign out. Please try again.' } };
  }
};

export const getCurrentUser = async () => {
  try {
    return await supabase.auth.getUser();
  } catch (error) {
    logError('Get current user error:', error);
    return { data: { user: null }, error };
  }
};

export const getCurrentSession = async () => {
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    logError('Get current session error:', error);
    return { data: { session: null }, error };
  }
};

export const refreshSession = async () => {
  try {
    return await supabase.auth.refreshSession();
  } catch (error) {
    logError('Refresh session error:', error);
    return { data: { session: null, user: null }, error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: 'swapit://reset-password',
    });
    
    if (error) {
      logError('Reset password error:', error);
    }
    
    return { data, error };
  } catch (error) {
    logError('Reset password exception:', error);
    return { 
      data: null, 
      error: { message: 'Network error. Please check your connection and try again.' } 
    };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      logError('Update password error:', error);
    }
    
    return { data, error };
  } catch (error) {
    logError('Update password exception:', error);
    return { 
      data: null, 
      error: { message: 'Failed to update password. Please try again.' } 
    };
  }
};

// Auth state change listener with error handling
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  try {
    return supabase.auth.onAuthStateChange((event, session) => {
      log('Auth state changed:', event, session?.user?.id);
      callback(event, session);
    });
  } catch (error) {
    logError('Auth state change listener error:', error);
    return { data: { subscription: null } };
  }
};

// Social authentication helpers
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'swapit://auth/callback',
      },
    });
    
    if (error) {
      logError('Google sign in error:', error);
    }
    
    return { data, error };
  } catch (error) {
    logError('Google sign in exception:', error);
    return { 
      data: null, 
      error: { message: 'Failed to sign in with Google. Please try again.' } 
    };
  }
};

export const signInWithApple = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'swapit://auth/callback',
      },
    });
    
    if (error) {
      logError('Apple sign in error:', error);
    }
    
    return { data, error };
  } catch (error) {
    logError('Apple sign in exception:', error);
    return { 
      data: null, 
      error: { message: 'Failed to sign in with Apple. Please try again.' } 
    };
  }
};

// Connection status helper
export const checkConnection = async () => {
  try {
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .single();
    
    return !error;
  } catch (error) {
    logError('Connection check failed:', error);
    return false;
  }
};