import { create } from 'zustand';
import { User } from '../types';
import * as authService from '../services/authService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
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
  isAdmin: false,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signIn(email, password);
      set({ user, isAuthenticated: true, isAdmin: false, loading: false });
    } catch (error: any) {
      let errorMessage = ERROR_MESSAGES.AUTH.NETWORK_ERROR;
      
      if (error.message.includes('wrong-password')) {
        errorMessage = ERROR_MESSAGES.AUTH.WRONG_PASSWORD;
      } else if (error.message.includes('user-not-found')) {
        errorMessage = ERROR_MESSAGES.AUTH.USER_NOT_FOUND;
      }
      
      set({ error: errorMessage, loading: false, isAuthenticated: false, isAdmin: false });
      throw error;
    }
  },

  loginAsAdmin: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Admin credentials - use Firebase auth
      const ADMIN_EMAIL = 'admin@pricesnap.com';
      const ADMIN_PASSWORD = 'Admin123!';
      
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Actually sign in with Firebase
        try {
          const user = await authService.signIn(email, password);
          set({ user, isAuthenticated: true, isAdmin: true, loading: false });
        } catch (authError: any) {
          // If admin user doesn't exist, create it
          if (authError.message.includes('user-not-found')) {
            const user = await authService.signUp(email, password, 'Administrator');
            set({ user, isAuthenticated: true, isAdmin: true, loading: false });
          } else {
            throw authError;
          }
        }
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error: any) {
      set({ 
        error: 'Invalid admin credentials', 
        loading: false, 
        isAuthenticated: false, 
        isAdmin: false 
      });
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
        // User is signed in - create user object from Firebase user
        const user: User = {
          userId: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || 'User',
          createdAt: new Date(),
        };
        
        set({ user, isAuthenticated: true, loading: false });
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

