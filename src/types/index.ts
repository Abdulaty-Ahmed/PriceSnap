import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// User Types
export interface User {
  userId: string;
  email: string;
  displayName: string;
  createdAt: Date;
  location?: GeoPoint;
  notificationToken?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// GeoPoint Type
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// Store Types
export interface Store {
  storeId: string;
  name: string;
  location: GeoPoint;
  address: string;
  addedBy: string;
  createdAt: Date;
}

// Product Types
export interface Product {
  productId: string;
  name: string;
  originalName: string;
  price: number;
  storeId: string;
  storeName: string;
  storeLocation: GeoPoint;
  imageUrl?: string;
  receiptId: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface ProductWithDistance extends Product {
  distance?: number;
}

// Receipt Types
export interface Receipt {
  receiptId: string;
  imageUrl: string;
  storeName: string;
  storeLocation: GeoPoint;
  uploadedBy: string;
  processedAt: Date;
  ocrText: string;
  productCount: number;
}

// Search Log Types
export interface SearchLog {
  searchId: string;
  userId: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
}

// API Response Types
export interface OCRResult {
  text: string;
  products: Array<{
    name: string;
    price: number;
  }>;
}

export interface OpenFoodFactsProduct {
  product_name: string;
  image_url?: string;
  image_front_url?: string;
}

export interface OpenFoodFactsResponse {
  products: OpenFoodFactsProduct[];
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Search: undefined;
  Upload: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Main: undefined;
  ProductDetail: { productId: string };
  MapView: { products: ProductWithDistance[] };
  ReviewReceipt: {
    imageUrl: string;
    storeName: string;
    storeLocation: { latitude: number; longitude: number };
    products: Array<{ name: string; price: number }>;
    ocrText: string;
  };
};

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UploadReceiptFormData {
  storeName: string;
  storeLocation: GeoPoint;
  imageUri: string;
}

