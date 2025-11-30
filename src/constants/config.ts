// App Configuration Constants

export const APP_CONFIG = {
  NAME: 'PriceSnap',
  VERSION: '1.0.0',
  AUTHOR: {
    NAME: 'Abdulaty Ahmed',
    STUDENT_ID: '2414506',
    COURSE: 'CNG 495 - Fall 2025',
  },
};

// Search Configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 500, // ms
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS: 50,
  DEFAULT_RADIUS: 10000, // 10km in meters
};

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  QUALITY: 0.8,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
};

// Location Configuration
export const LOCATION_CONFIG = {
  ACCURACY: 'high' as const,
  TIMEOUT: 10000, // 10 seconds
  MAX_AGE: 60000, // 1 minute
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  PRICE_DROP_THRESHOLD: 0.1, // 10% price drop
  MAX_DISTANCE_FOR_ALERTS: 5000, // 5km in meters
};

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  STORES: 'stores',
  PRODUCTS: 'products',
  RECEIPTS: 'receipts',
  SEARCH_LOGS: 'searchLogs',
};

// API Endpoints
export const API_ENDPOINTS = {
  OPENFOODFACTS_SEARCH: 'https://world.openfoodfacts.org/cgi/search.pl',
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_EMAIL: 'Please enter a valid email address',
    WEAK_PASSWORD: 'Password must be at least 6 characters',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    EMAIL_IN_USE: 'This email is already registered',
    WRONG_PASSWORD: 'Incorrect password',
    USER_NOT_FOUND: 'No account found with this email',
    NETWORK_ERROR: 'Network error. Please check your connection',
  },
  CAMERA: {
    PERMISSION_DENIED: 'Camera permission denied',
    NOT_AVAILABLE: 'Camera not available on this device',
  },
  LOCATION: {
    PERMISSION_DENIED: 'Location permission denied',
    NOT_AVAILABLE: 'Location services not available',
    TIMEOUT: 'Location request timed out',
  },
  UPLOAD: {
    FAILED: 'Failed to upload image',
    INVALID_FILE: 'Invalid file type',
    FILE_TOO_LARGE: 'File size exceeds 5MB limit',
  },
  OCR: {
    FAILED: 'Failed to process receipt',
    NO_TEXT_FOUND: 'No text found in image',
  },
  SEARCH: {
    FAILED: 'Search failed. Please try again',
    NO_RESULTS: 'No products found',
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGGED_IN: 'Successfully logged in',
    REGISTERED: 'Account created successfully',
    LOGGED_OUT: 'Successfully logged out',
  },
  UPLOAD: {
    SUCCESS: 'Receipt uploaded and processed successfully',
  },
};

