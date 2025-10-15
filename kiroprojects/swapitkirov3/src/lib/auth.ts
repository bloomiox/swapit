import { supabase } from './supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export type AuthUser = User | null
export type AuthSession = Session | null

// Auth state management
export const auth = {
  // Get current user
  getCurrentUser: async (): Promise<AuthUser> => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get current session
  getCurrentSession: async (): Promise<AuthSession> => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: { full_name?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in with OAuth provider
  signInWithProvider: async (provider: 'google' | 'facebook' | 'apple') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  // Update user metadata
  updateUser: async (userData: { full_name?: string; avatar_url?: string }) => {
    const { data, error } = await supabase.auth.updateUser({
      data: userData
    })
    return { data, error }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: AuthSession) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Helper functions
export const isAuthenticated = (user: AuthUser): boolean => {
  return user !== null
}

export const getUserId = (user: AuthUser): string | null => {
  return user?.id || null
}

export const getUserEmail = (user: AuthUser): string | null => {
  return user?.email || null
}

export const getUserMetadata = (user: AuthUser) => {
  return user?.user_metadata || {}
}