// Validation utility functions

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePrice = (price: string): boolean => {
  const priceRegex = /^\d+\.?\d{0,2}$/;
  return priceRegex.test(price) && parseFloat(price) > 0;
};

export const validateImageUri = (uri: string): boolean => {
  return uri.length > 0 && (uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('http'));
};

export const sanitizeProductName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
};

export const normalizeProductName = (name: string): string => {
  // Remove extra spaces, special characters, and standardize format
  let normalized = name.trim();
  
  // Convert to title case
  normalized = normalized
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Common replacements for standardization
  normalized = normalized
    .replace(/\b(\d+)\s*(oz|ounce|ounces)\b/gi, '$1oz')
    .replace(/\b(\d+)\s*(lb|pound|pounds)\b/gi, '$1lb')
    .replace(/\b(\d+)\s*(ml|milliliter|milliliters)\b/gi, '$1ml')
    .replace(/\b(\d+)\s*(l|liter|liters)\b/gi, '$1L')
    .replace(/\b(\d+)\s*(g|gram|grams)\b/gi, '$1g')
    .replace(/\b(\d+)\s*(kg|kilogram|kilograms)\b/gi, '$1kg');
  
  return normalized;
};

