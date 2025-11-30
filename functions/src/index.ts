import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import vision from '@google-cloud/vision';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const visionClient = new vision.ImageAnnotatorClient();

/**
 * Process Receipt Cloud Function
 * Extracts text from receipt image using OCR, parses products and prices,
 * fetches product images, and stores data in Firestore
 */
export const processReceipt = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to upload receipts'
    );
  }

  const { imageUrl, storeName, storeLocation, userId } = data;

  // Validate input
  if (!imageUrl || !storeName || !storeLocation || !userId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields'
    );
  }

  try {
    // Step 1: Perform OCR on the image
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

    // Step 2: Parse products and prices from text
    const products = parseReceiptText(fullText);
    console.log('Parsed products:', products);

    if (products.length === 0) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No products found in receipt'
      );
    }

    // Step 3: Create/Update store document
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

    // Step 4: Create receipt document
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
      ocrText: fullText,
      productCount: products.length,
    });

    // Step 5: Process each product
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
 */
function parseReceiptText(text: string): Array<{ name: string; price: number }> {
  const products: Array<{ name: string; price: number }> = [];
  const lines = text.split('\n');

  // Price pattern: matches prices like $1.99, 1.99, $1,234.99
  const pricePattern = /\$?(\d{1,3}(?:,\d{3})*\.?\d{0,2})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and common receipt headers/footers
    if (!line || 
        line.toLowerCase().includes('total') ||
        line.toLowerCase().includes('subtotal') ||
        line.toLowerCase().includes('tax') ||
        line.toLowerCase().includes('change') ||
        line.toLowerCase().includes('thank you')) {
      continue;
    }

    // Look for price in current line
    const priceMatch = line.match(pricePattern);
    
    if (priceMatch) {
      const priceStr = priceMatch[1].replace(',', '');
      const price = parseFloat(priceStr);
      
      // Skip invalid prices (too large or too small)
      if (price > 0 && price < 10000) {
        // Extract product name (everything before the price)
        let productName = line.substring(0, priceMatch.index).trim();
        
        // Remove quantity indicators like "2x" or "x2"
        productName = productName.replace(/^\d+x?\s*/i, '').trim();
        productName = productName.replace(/\s*x\d+$/i, '').trim();
        
        if (productName.length > 2) {
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
        console.log(`New lowest price found for ${name}: $${price}`);
        
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

