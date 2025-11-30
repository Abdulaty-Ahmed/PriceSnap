import { create } from 'zustand';
import { GeoPoint } from '../types';
import * as storageService from '../services/storageService';
import * as locationService from '../services/locationService';
import { ERROR_MESSAGES } from '../constants';

interface UploadState {
  imageUri: string | null;
  storeName: string;
  storeLocation: GeoPoint | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
  
  // Actions
  setImageUri: (uri: string | null) => void;
  setStoreName: (name: string) => void;
  setStoreLocation: (location: GeoPoint | null) => void;
  getCurrentLocation: () => Promise<void>;
  clearForm: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  imageUri: null,
  storeName: '',
  storeLocation: null,
  loading: false,
  error: null,
  uploadProgress: 0,

  setImageUri: (uri: string | null) => {
    set({ imageUri: uri, error: null });
  },

  setStoreName: (name: string) => {
    set({ storeName: name });
  },

  setStoreLocation: (location: GeoPoint | null) => {
    set({ storeLocation: location });
  },

  getCurrentLocation: async () => {
    set({ loading: true, error: null });
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        set({ storeLocation: location, loading: false });
      } else {
        set({ error: ERROR_MESSAGES.LOCATION.PERMISSION_DENIED, loading: false });
      }
    } catch (error: any) {
      set({ error: ERROR_MESSAGES.LOCATION.NOT_AVAILABLE, loading: false });
    }
  },

  clearForm: () => {
    set({
      imageUri: null,
      storeName: '',
      storeLocation: null,
      error: null,
      uploadProgress: 0,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

