import { create } from 'zustand';
import { User } from '../types';
import * as authService from '../services/authService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signIn(email, password);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      let errorMessage = ERROR_MESSAGES.AUTH.NETWORK_ERROR;
      
      if (error.message.includes('wrong-password')) {
        errorMessage = ERROR_MESSAGES.AUTH.WRONG_PASSWORD;
      } else if (error.message.includes('user-not-found')) {
        errorMessage = ERROR_MESSAGES.AUTH.USER_NOT_FOUND;
      }
      
      set({ error: errorMessage, loading: false, isAuthenticated: false });
      throw error;
    }
  },

  register: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signUp(email, password, displayName);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      let errorMessage = ERROR_MESSAGES.AUTH.NETWORK_ERROR;
      
      if (error.message.includes('email-already-in-use')) {
        errorMessage = ERROR_MESSAGES.AUTH.EMAIL_IN_USE;
      }
      
      set({ error: errorMessage, loading: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authService.signOut();
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const user = await authService.signIn(
            firebaseUser.email!,
            '' // Password not needed for re-authentication
          ).catch(() => {
            // If sign-in fails, create user object from Firebase user
            return {
              userId: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || 'User',
              createdAt: new Date(),
            };
          });
          
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, loading: false });
        }
      } else {
        // User is signed out
        set({ user: null, isAuthenticated: false, loading: false });
      }
    });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));

