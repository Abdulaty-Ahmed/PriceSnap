import axios from 'axios';
import { API_ENDPOINTS } from '../constants';
import type { OpenFoodFactsResponse } from '../types';

/**
 * Search for product image on OpenFoodFacts
 * @param productName Product name to search
 * @returns Image URL or null if not found
 */
export const searchProductImage = async (productName: string): Promise<string | null> => {
  try {
    const response = await axios.get<OpenFoodFactsResponse>(API_ENDPOINTS.OPENFOODFACTS_SEARCH, {
      params: {
        search_terms: productName,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 5,
      },
    });

    if (response.data.products && response.data.products.length > 0) {
      // Try to find the best match
      for (const product of response.data.products) {
        if (product.image_url || product.image_front_url) {
          return product.image_url || product.image_front_url || null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching product image from OpenFoodFacts:', error);
    return null;
  }
};

/**
 * Get placeholder image URL
 */
export const getPlaceholderImage = (): string => {
  return 'https://via.placeholder.com/300x300.png?text=No+Image';
};

/**
 * Fetch product image with fallback
 * @param productName Product name to search
 * @returns Image URL (real or placeholder)
 */
export const fetchProductImage = async (productName: string): Promise<string> => {
  const imageUrl = await searchProductImage(productName);
  return imageUrl || getPlaceholderImage();
};

