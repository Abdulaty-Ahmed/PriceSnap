import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase configuration
// TODO: Replace with your Firebase project configuration
// Get these values from Firebase Console > Project Settings > General > Your apps
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
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app, auth, db, storage, functions };

