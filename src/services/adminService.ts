import { httpsCallable } from 'firebase/functions';
import { functions } from './firebaseConfig';

// Define the Cloud Function types
const getFirestoreStatsFunction = httpsCallable<void, Record<string, number>>(
  functions,
  'getFirestoreStats'
);

const resetDatabaseFunction = httpsCallable<void, { success: boolean; message: string }>(
  functions,
  'resetDatabase'
);

const backupDatabaseFunction = httpsCallable<void, { success: boolean; message: string; timestamp: string }>(
  functions,
  'backupDatabase'
);

/**
 * Get Firestore statistics (document counts for all collections)
 */
export const getFirestoreStats = async (): Promise<Record<string, number>> => {
  try {
    const result = await getFirestoreStatsFunction();
    return result.data;
  } catch (error: any) {
    console.error('Error getting Firestore stats:', error);
    throw new Error(error.message || 'Failed to get database statistics');
  }
};

/**
 * Reset the database (delete all products, stores, receipts, searchLogs)
 * Users are preserved for safety
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    const result = await resetDatabaseFunction();
    console.log('Reset database result:', result.data);
  } catch (error: any) {
    console.error('Error resetting database:', error);
    throw new Error(error.message || 'Failed to reset database');
  }
};

/**
 * Backup database (logs all data to Cloud Function console)
 */
export const backupDatabase = async (): Promise<void> => {
  try {
    const result = await backupDatabaseFunction();
    console.log('Backup database result:', result.data);
  } catch (error: any) {
    console.error('Error backing up database:', error);
    throw new Error(error.message || 'Failed to backup database');
  }
};

/**
 * Get all documents from a specific collection
 * Note: This uses direct Firestore access which may be limited by security rules
 * For production, consider creating a Cloud Function for this as well
 */
export const getCollectionData = async (collectionName: string): Promise<any[]> => {
  // Import dynamically to avoid circular dependencies
  const { collection, getDocs } = await import('firebase/firestore');
  const { db } = await import('./firebaseConfig');
  
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error(`Error getting ${collectionName} data:`, error);
    throw new Error(error.message || `Failed to load ${collectionName} data`);
  }
};

/**
 * Delete a specific document from a collection
 * Note: This uses direct Firestore access which may be limited by security rules
 * Admin must be authenticated and Firestore rules must allow this
 */
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  // Import dynamically to avoid circular dependencies
  const { doc, deleteDoc } = await import('firebase/firestore');
  const { db } = await import('./firebaseConfig');
  
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error: any) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error(error.message || 'Failed to delete document');
  }
};



