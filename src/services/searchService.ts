import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { COLLECTIONS, SEARCH_CONFIG } from '../constants';
import { calculateDistance, sortByDistance } from '../utils/distance';
import type { Product, ProductWithDistance, GeoPoint, SearchLog } from '../types';

/**
 * Search products by name
 * @param searchQuery Product name to search
 * @param userLocation User's current location
 * @returns Array of products with distance
 */
export const searchProducts = async (
  searchQuery: string,
  userLocation: GeoPoint | null
): Promise<ProductWithDistance[]> => {
  try {
    if (searchQuery.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
      return [];
    }

    // Normalize search query
    const normalizedQuery = searchQuery.toLowerCase().trim();

    // Query Firestore
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(
      productsRef,
      orderBy('createdAt', 'desc'),
      limit(SEARCH_CONFIG.MAX_RESULTS)
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const productName = data.name.toLowerCase();
      
      // Simple text matching (contains query)
      if (productName.includes(normalizedQuery)) {
        products.push({
          productId: doc.id,
          name: data.name,
          originalName: data.originalName,
          price: data.price,
          storeId: data.storeId,
          storeName: data.storeName,
          storeLocation: data.storeLocation,
          imageUrl: data.imageUrl,
          receiptId: data.receiptId,
          uploadedBy: data.uploadedBy,
          createdAt: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        });
      }
    });

    // Add distance if user location is available
    if (userLocation) {
      const productsWithDistance = sortByDistance(products, userLocation);
      return productsWithDistance;
    }

    return products.map(p => ({ ...p, distance: undefined }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

/**
 * Get cheapest product nearby
 * @param productName Product name to search
 * @param userLocation User's current location
 * @param maxDistance Maximum distance in meters
 * @returns Cheapest product or null
 */
export const getCheapestNearby = async (
  productName: string,
  userLocation: GeoPoint,
  maxDistance: number = SEARCH_CONFIG.DEFAULT_RADIUS
): Promise<ProductWithDistance | null> => {
  try {
    const products = await searchProducts(productName, userLocation);

    // Filter by distance and sort by price
    const nearbyProducts = products
      .filter(p => p.distance && p.distance <= maxDistance)
      .sort((a, b) => a.price - b.price);

    return nearbyProducts.length > 0 ? nearbyProducts[0] : null;
  } catch (error) {
    console.error('Error finding cheapest product:', error);
    return null;
  }
};

/**
 * Log search query
 */
export const logSearch = async (
  userId: string,
  query: string,
  resultsCount: number
): Promise<void> => {
  try {
    const searchLog: Omit<SearchLog, 'searchId'> = {
      userId,
      query,
      timestamp: new Date(),
      resultsCount,
    };

    await addDoc(collection(db, COLLECTIONS.SEARCH_LOGS), {
      ...searchLog,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging search:', error);
    // Don't throw error, logging is not critical
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(productsRef, where('productId', '==', productId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        productId: doc.id,
        name: data.name,
        originalName: data.originalName,
        price: data.price,
        storeId: data.storeId,
        storeName: data.storeName,
        storeLocation: data.storeLocation,
        imageUrl: data.imageUrl,
        receiptId: data.receiptId,
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

/**
 * Get all products sorted by price
 */
export const getAllProductsSortedByPrice = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(
      productsRef,
      orderBy('price', 'asc'),
      limit(SEARCH_CONFIG.MAX_RESULTS)
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        productId: doc.id,
        name: data.name,
        originalName: data.originalName,
        price: data.price,
        storeId: data.storeId,
        storeName: data.storeName,
        storeLocation: data.storeLocation,
        imageUrl: data.imageUrl,
        receiptId: data.receiptId,
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      });
    });

    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

