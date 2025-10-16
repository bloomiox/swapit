import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '@supabase/supabase-js';
import { signIn, signUp, signOut, getCurrentSession, onAuthStateChange } from '../services/supabase';
import { log, logError } from '../config/environment';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      isInitialized: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await signIn(email, password);
          
          if (error) {
            set({ isLoading: false });
            return { error };
          }
          
          if (data) {
            set({
              user: data.user,
              session: data.session,
              isAuthenticated: !!data.user,
              isLoading: false,
            });
          }
          
          log('User signed in successfully:', data?.user?.id);
          return {};
        } catch (error) {
          logError('Sign in error in store:', error);
          set({ isLoading: false });
          return { error: { message: 'An unexpected error occurred during sign in.' } };
        }
      },

      signUp: async (email: string, password: string, userData?: any) => {
        set({ isLoading: true });
        
        try {
          const { data, error } = await signUp(email, password, userData);
          
          if (error) {
            set({ isLoading: false });
            return { error };
          }
          
          if (data) {
            set({
              user: data.user,
              session: data.session,
              isAuthenticated: !!data.user,
              isLoading: false,
            });
          }
          
          log('User signed up successfully:', data?.user?.id);
          return {};
        } catch (error) {
          logError('Sign up error in store:', error);
          set({ isLoading: false });
          return { error: { message: 'An unexpected error occurred during sign up.' } };
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        
        try {
          // Stop token refresh service before signing out
          const { tokenRefreshService } = await import('../services/tokenRefresh');
          tokenRefreshService.stop();
          
          await signOut();
          
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          log('User signed out successfully');
        } catch (error) {
          logError('Sign out error in store:', error);
          // Even if sign out fails, clear local state
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      setSession: (session: Session | null) => {
        set({ 
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user
        });
      },

      clearAuth: () => {
        // Stop token refresh service
        import('../services/tokenRefresh').then(({ tokenRefreshService }) => {
          tokenRefreshService.stop();
        });
        
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initialize: async () => {
        if (get().isInitialized) {
          return;
        }

        set({ isLoading: true });
        
        try {
          // Get current session
          const { data: { session }, error } = await getCurrentSession();
          
          if (error) {
            logError('Error getting current session:', error);
          }
          
          set({
            user: session?.user ?? null,
            session,
            isAuthenticated: !!session?.user,
            isLoading: false,
            isInitialized: true,
          });
          
          // Start token refresh service if user is authenticated
          if (session?.user) {
            const { tokenRefreshService } = await import('../services/tokenRefresh');
            
            // Initialize the service with auth store callbacks
            tokenRefreshService.initialize({
              getAuthState: () => {
                const state = get();
                return {
                  session: state.session,
                  isAuthenticated: state.isAuthenticated
                };
              },
              setSession: (session) => set({ 
                session,
                user: session?.user ?? null,
                isAuthenticated: !!session?.user
              }),
              clearAuth: () => set({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false,
              })
            });
            
            tokenRefreshService.start();
          }
          
          // Set up auth state change listener
          const authListener = onAuthStateChange((event, session) => {
            log('Auth state change event:', event);
            
            set({
              user: session?.user ?? null,
              session,
              isAuthenticated: !!session?.user,
            });
            
            // Handle specific auth events
            switch (event) {
              case 'SIGNED_IN':
                log('User signed in via auth state change');
                // Start token refresh service
                import('../services/tokenRefresh').then(({ tokenRefreshService }) => {
                  tokenRefreshService.initialize({
                    getAuthState: () => {
                      const state = get();
                      return {
                        session: state.session,
                        isAuthenticated: state.isAuthenticated
                      };
                    },
                    setSession: (session) => set({ 
                      session,
                      user: session?.user ?? null,
                      isAuthenticated: !!session?.user
                    }),
                    clearAuth: () => set({
                      user: null,
                      session: null,
                      isAuthenticated: false,
                      isLoading: false,
                    })
                  });
                  tokenRefreshService.start();
                });
                break;
              case 'SIGNED_OUT':
                log('User signed out via auth state change');
                // Stop token refresh service
                import('../services/tokenRefresh').then(({ tokenRefreshService }) => {
                  tokenRefreshService.stop();
                });
                break;
              case 'TOKEN_REFRESHED':
                log('Token refreshed via auth state change');
                break;
              case 'USER_UPDATED':
                log('User updated via auth state change');
                break;
            }
          });
          
          // Store subscription for cleanup if needed
          if (authListener) {
            log('Auth state change listener set up successfully');
          }
          
        } catch (error) {
          logError('Error initializing auth:', error);
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
      // Don't persist loading states
      skipHydration: false,
    }
  )
);