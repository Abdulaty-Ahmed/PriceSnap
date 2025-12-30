import { httpsCallable } from 'firebase/functions';
import { functions } from './firebaseConfig';

interface ParseReceiptResult {
  success: boolean;
  products: Array<{ name: string; price: number }>;
  ocrText: string;
}

interface ProcessReceiptResult {
  success: boolean;
  receiptId: string;
  storeId: string;
  productCount: number;
  productIds: string[];
}

/**
 * Parse receipt using OCR - returns parsed products for user review
 */
export const parseReceiptOCR = async (
  imageUrl: string
): Promise<ParseReceiptResult> => {
  try {
    const parseReceiptFn = httpsCallable<
      { imageUrl: string },
      ParseReceiptResult
    >(functions, 'parseReceiptOCR');

    const result = await parseReceiptFn({ imageUrl });
    return result.data;
  } catch (error: any) {
    console.error('Error parsing receipt:', error);
    throw new Error(error.message || 'Failed to parse receipt');
  }
};

/**
 * Process receipt - saves confirmed products to Firestore
 */
export const processReceipt = async (
  imageUrl: string,
  storeName: string,
  storeLocation: { latitude: number; longitude: number },
  userId: string,
  products: Array<{ name: string; price: number }>,
  ocrText: string
): Promise<ProcessReceiptResult> => {
  try {
    const processReceiptFn = httpsCallable<
      {
        imageUrl: string;
        storeName: string;
        storeLocation: { latitude: number; longitude: number };
        userId: string;
        products: Array<{ name: string; price: number }>;
        ocrText: string;
      },
      ProcessReceiptResult
    >(functions, 'processReceipt');

    const result = await processReceiptFn({
      imageUrl,
      storeName,
      storeLocation,
      userId,
      products,
      ocrText,
    });

    return result.data;
  } catch (error: any) {
    console.error('Error processing receipt:', error);
    throw new Error(error.message || 'Failed to process receipt');
  }
};



