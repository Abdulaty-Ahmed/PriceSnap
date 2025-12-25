import { initializeApp, FirebaseApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXOAzRbTe7f_sAmkSQgBvOjSgWPrdLZEg",
  authDomain: "pricesnap-d0302.firebaseapp.com",
  projectId: "pricesnap-d0302",
  storageBucket: "pricesnap-d0302.firebasestorage.app",
  messagingSenderId: "634811974260",
  appId: "1:634811974260:web:85d37a5cc47aa1d2774721",
  measurementId: "G-HSPYXQQ1BQ"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let functions: Functions | null = null;

try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized');
  } else {
    app = getApp();
    console.log('Using existing Firebase app');
  }
  
  // Initialize Auth with AsyncStorage persistence
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('Firebase Auth initialized with AsyncStorage');
  } catch (error: any) {
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
      console.log('Using existing Firebase Auth');
    } else {
      console.error('Firebase Auth initialization error:', error.message);
    }
  }
  
  // Initialize Firestore
  try {
    db = getFirestore(app);
    console.log('Firestore initialized');
  } catch (error: any) {
    console.error('Firestore initialization error:', error.message);
  }
  
  // Initialize Storage
  try {
    storage = getStorage(app);
    console.log('Storage initialized');
  } catch (error: any) {
    console.error('Storage initialization error:', error.message);
  }
  
  // Initialize Functions
  try {
    functions = getFunctions(app);
    console.log('Functions initialized');
  } catch (error: any) {
    console.error('Functions initialization error:', error.message);
  }
  
  console.log('Firebase initialization complete');
} catch (error: any) {
  console.error('Critical Firebase initialization error:', error);
  // Create a mock app to prevent crashes
  app = {} as FirebaseApp;
}

export { app, auth, db, storage, functions };

