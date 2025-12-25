import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import vision from '@google-cloud/vision';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const visionClient = new vision.ImageAnnotatorClient();

/**
 * Parse Receipt OCR Cloud Function
 * Only extracts and parses text from receipt, returns results for user review
 * Does NOT save to Firestore
 */
export const parseReceiptOCR = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to parse receipts'
    );
  }

  const { imageUrl } = data;

  // Validate input
  if (!imageUrl) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing image URL'
    );
  }

  try {
    // Perform OCR on the image
    console.log('Starting OCR processing for:', imageUrl);
    const [result] = await visionClient.textDetection(imageUrl);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No text found in image'
      );
    }

    const fullText = detections[0].description || '';
    console.log('OCR Text:', fullText);

    // Parse products and prices from text
    const products = parseReceiptText(fullText);
    console.log('Parsed products:', products);

    return {
      success: true,
      products,
      ocrText: fullText,
    };
  } catch (error: any) {
    console.error('Error parsing receipt:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to parse receipt'
    );
  }
});

/**
 * Process Receipt Cloud Function
 * Saves confirmed products to Firestore after user review
 */
export const processReceipt = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to upload receipts'
    );
  }

  const { imageUrl, storeName, storeLocation, userId, products, ocrText } = data;

  // Validate input
  if (!imageUrl || !storeName || !storeLocation || !userId || !products) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields'
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'No products provided'
    );
  }

  try {

    // Step 1: Create/Update store document
    const storeRef = db.collection('stores').doc();
    await storeRef.set({
      storeId: storeRef.id,
      name: storeName,
      location: new admin.firestore.GeoPoint(
        storeLocation.latitude,
        storeLocation.longitude
      ),
      address: `${storeLocation.latitude.toFixed(4)}, ${storeLocation.longitude.toFixed(4)}`,
      addedBy: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Step 2: Create receipt document
    const receiptRef = db.collection('receipts').doc();
    await receiptRef.set({
      receiptId: receiptRef.id,
      imageUrl,
      storeName,
      storeLocation: new admin.firestore.GeoPoint(
        storeLocation.latitude,
        storeLocation.longitude
      ),
      uploadedBy: userId,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      ocrText: ocrText || '',
      productCount: products.length,
    });

    // Step 3: Process each product
    const productPromises = products.map(async (product) => {
      // Fetch product image from OpenFoodFacts
      const imageUrl = await fetchProductImage(product.name);

      // Create product document
      const productRef = db.collection('products').doc();
      await productRef.set({
        productId: productRef.id,
        name: normalizeProductName(product.name),
        originalName: product.name,
        price: product.price,
        storeId: storeRef.id,
        storeName,
        storeLocation: new admin.firestore.GeoPoint(
          storeLocation.latitude,
          storeLocation.longitude
        ),
        imageUrl,
        receiptId: receiptRef.id,
        uploadedBy: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return productRef.id;
    });

    const productIds = await Promise.all(productPromises);

    return {
      success: true,
      receiptId: receiptRef.id,
      storeId: storeRef.id,
      productCount: products.length,
      productIds,
    };
  } catch (error: any) {
    console.error('Error processing receipt:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to process receipt'
    );
  }
});

/**
 * Parse receipt text to extract products and prices
 * Supports Turkish receipts with TL currency and comma as decimal separator
 * Handles multi-line format where product name, percentage, and price are on separate lines
 */
function parseReceiptText(text: string): Array<{ name: string; price: number }> {
  const products: Array<{ name: string; price: number }> = [];
  const lines = text.split('\n').map(l => l.trim());

  // Price patterns: matches *29,99 or *29.99 or ₺29,99
  const pricePattern = /^[*₺]\s*(\d{1,4})[,\.](\d{2})$/;
  
  // Percentage pattern: %5, %16, etc.
  const percentagePattern = /^%\d+$/;

  // Date/time patterns to skip
  const datePattern = /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/;
  const timePattern = /\d{1,2}:\d{2}(:\d{2})?/;

  // Skip keywords (both English and Turkish)
  const skipKeywords = [
    'total', 'toplam', 'topkdv', 'subtotal', 'tax', 'kdv', 'change',
    'thank you', 'teşekkür', 'tarih', 'saat', 'fis no', 'nakit', 
    'odeme', 'ödeme', 'tutari', 'kredi kart'
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines
    if (!line) {
      continue;
    }

    // Skip date/time lines
    if (datePattern.test(line) && timePattern.test(line)) {
      continue;
    }

    // Skip lines with KILOGRAM X price format (weighted items)
    if (line.includes('KILOGRAM X') || line.includes('KİLOGRAM X')) {
      continue;
    }

    // Skip common receipt headers/footers
    const lowerLine = line.toLowerCase();
    if (skipKeywords.some(keyword => lowerLine.includes(keyword))) {
      continue;
    }

    // Check if current line is a price
    const priceMatch = line.match(pricePattern);
    
    if (priceMatch) {
      const integerPart = priceMatch[1];
      const decimalPart = priceMatch[2];
      const price = parseFloat(`${integerPart}.${decimalPart}`);
      
      // Skip invalid prices
      if (price <= 0 || price >= 10000) {
        continue;
      }

      // Look backwards for product name (skip percentage line if present)
      let productName = '';
      let lookbackIndex = i - 1;

      // Skip percentage line if present
      if (lookbackIndex >= 0 && percentagePattern.test(lines[lookbackIndex])) {
        lookbackIndex--;
      }

      // Get product name
      if (lookbackIndex >= 0) {
        productName = lines[lookbackIndex].trim();
        
        // Clean up product name
        // Remove trailing numbers (sizes like "500")
        productName = productName.replace(/\s+\d+\s*$/, '').trim();
        
        // Remove size indicators
        productName = productName.replace(/\s*\d+\s*(ML|L|G|KG|GRAM|KILOGRAM)\s*$/gi, '').trim();
        
        // Remove quantity indicators
        productName = productName.replace(/^\d+x?\s*/i, '').trim();
        productName = productName.replace(/\s*x\d+$/i, '').trim();
        
        // Remove percentage if somehow still there
        productName = productName.replace(/\s*%\d+\s*$/g, '').trim();
        
        // Clean up extra whitespace
        productName = productName.replace(/\s+/g, ' ').trim();
        
        // Simple validation: just check it's not empty and has reasonable length
        if (productName.length > 0) {
          products.push({
            name: productName,
            price,
          });
        }
      }
    }
  }

  return products;
}

/**
 * Normalize product name for consistent searching
 */
function normalizeProductName(name: string): string {
  let normalized = name.trim();
  
  // Convert to title case
  normalized = normalized
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Standardize units
  normalized = normalized
    .replace(/\b(\d+)\s*(oz|ounce|ounces)\b/gi, '$1oz')
    .replace(/\b(\d+)\s*(lb|pound|pounds)\b/gi, '$1lb')
    .replace(/\b(\d+)\s*(ml|milliliter|milliliters)\b/gi, '$1ml')
    .replace(/\b(\d+)\s*(l|liter|liters)\b/gi, '$1L')
    .replace(/\b(\d+)\s*(g|gram|grams)\b/gi, '$1g')
    .replace(/\b(\d+)\s*(kg|kilogram|kilograms)\b/gi, '$1kg');
  
  return normalized;
}

/**
 * Fetch product image from OpenFoodFacts API
 */
async function fetchProductImage(productName: string): Promise<string> {
  try {
    const response = await axios.get('https://world.openfoodfacts.org/cgi/search.pl', {
      params: {
        search_terms: productName,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 5,
      },
    });

    if (response.data.products && response.data.products.length > 0) {
      for (const product of response.data.products) {
        if (product.image_url || product.image_front_url) {
          return product.image_url || product.image_front_url;
        }
      }
    }

    return 'https://via.placeholder.com/300x300.png?text=No+Image';
  } catch (error) {
    console.error('Error fetching product image:', error);
    return 'https://via.placeholder.com/300x300.png?text=No+Image';
  }
}

/**
 * Send Price Alerts Cloud Function
 * Triggered when a new product is added, checks if it's cheaper
 * and sends notifications to nearby users
 */
export const sendPriceAlerts = functions.firestore
  .document('products/{productId}')
  .onCreate(async (snap, context) => {
    const newProduct = snap.data();
    const { name, price } = newProduct;

    try {
      // Find existing products with the same name
      const existingProducts = await db
        .collection('products')
        .where('name', '==', name)
        .get();

      let lowestPrice = price;
      existingProducts.forEach((doc) => {
        const product = doc.data();
        if (product.price < lowestPrice && doc.id !== snap.id) {
          lowestPrice = product.price;
        }
      });

      // If this is the new lowest price
      if (price < lowestPrice) {
        console.log(`New lowest price found for ${name}: ${price}`);
        
        // Get all users (in production, filter by location proximity)
        const usersSnapshot = await db.collection('users').get();
        
        const notificationPromises = usersSnapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          
          if (userData.notificationToken) {
            // Send push notification via Expo
            // Note: In production, you'd use Expo's push notification service
            console.log(`Would send notification to user ${userDoc.id}`);
          }
        });

        await Promise.all(notificationPromises);
      }

      return null;
    } catch (error) {
      console.error('Error sending price alerts:', error);
      return null;
    }
  });

/**
 * Helper function to verify admin access
 */
function isAdmin(context: functions.https.CallableContext): boolean {
  if (!context.auth) {
    return false;
  }
  // Check if the user's email is the admin email
  return context.auth.token.email === 'admin@pricesnap.com';
}

/**
 * Get Firestore Statistics
 * Returns count of documents in all collections
 */
export const getFirestoreStats = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can access database statistics'
    );
  }

  try {
    const collections = ['users', 'products', 'stores', 'receipts', 'searchLogs'];
    const stats: Record<string, number> = {};

    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).count().get();
      stats[collectionName] = snapshot.data().count;
    }

    console.log('Firestore stats:', stats);
    return stats;
  } catch (error: any) {
    console.error('Error getting Firestore stats:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to get database statistics'
    );
  }
});

/**
 * Reset Database
 * Deletes all documents from specified collections
 */
export const resetDatabase = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can reset the database'
    );
  }

  try {
    const collections = ['products', 'stores', 'receipts', 'searchLogs'];
    // Note: We don't delete users collection for safety
    
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Deleted ${snapshot.size} documents from ${collectionName}`);
    }

    return {
      success: true,
      message: 'Database reset successfully (users preserved)',
    };
  } catch (error: any) {
    console.error('Error resetting database:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to reset database'
    );
  }
});

/**
 * Backup Database
 * Logs all data to console for backup purposes
 */
export const backupDatabase = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!isAdmin(context)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can backup the database'
    );
  }

  try {
    const collections = ['users', 'products', 'stores', 'receipts', 'searchLogs'];
    const backup: Record<string, any[]> = {};

    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      backup[collectionName] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(`Backup of ${collectionName}:`, JSON.stringify(backup[collectionName], null, 2));
    }

    return {
      success: true,
      message: 'Database backup logged to Cloud Functions console',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error backing up database:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to backup database'
    );
  }
});

