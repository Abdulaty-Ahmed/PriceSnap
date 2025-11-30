import { create } from 'zustand';
import { ProductWithDistance, GeoPoint } from '../types';
import * as searchService from '../services/searchService';
import * as locationService from '../services/locationService';
import { ERROR_MESSAGES } from '../constants';

interface SearchState {
  searchQuery: string;
  searchResults: ProductWithDistance[];
  loading: boolean;
  error: string | null;
  userLocation: GeoPoint | null;
  sortBy: 'price' | 'distance';
  
  // Actions
  setSearchQuery: (query: string) => void;
  search: (query: string, userId?: string) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
  updateUserLocation: () => Promise<void>;
  setSortBy: (sortBy: 'price' | 'distance') => void;
  sortResults: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  searchResults: [],
  loading: false,
  error: null,
  userLocation: null,
  sortBy: 'price',

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  search: async (query: string, userId?: string) => {
    set({ loading: true, error: null, searchQuery: query });
    try {
      const { userLocation } = get();
      const results = await searchService.searchProducts(query, userLocation);
      
      // Log search if userId is provided
      if (userId) {
        searchService.logSearch(userId, query, results.length);
      }
      
      set({ searchResults: results, loading: false });
      
      // Sort results based on current sort preference
      get().sortResults();
    } catch (error: any) {
      set({ 
        error: ERROR_MESSAGES.SEARCH.FAILED, 
        loading: false,
        searchResults: [] 
      });
    }
  },

  clearResults: () => {
    set({ searchResults: [], searchQuery: '', error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  updateUserLocation: async () => {
    try {
      const location = await locationService.getCurrentLocation();
      set({ userLocation: location });
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  },

  setSortBy: (sortBy: 'price' | 'distance') => {
    set({ sortBy });
    get().sortResults();
  },

  sortResults: () => {
    const { searchResults, sortBy, userLocation } = get();
    
    if (searchResults.length === 0) return;
    
    let sorted = [...searchResults];
    
    if (sortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'distance' && userLocation) {
      sorted.sort((a, b) => {
        const distA = a.distance ?? Infinity;
        const distB = b.distance ?? Infinity;
        return distA - distB;
      });
    }
    
    set({ searchResults: sorted });
  },
}));

