import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { COLLECTIONS } from '../constants';
import type { User as AppUser } from '../types';

/**
 * Register a new user
 */
export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<AppUser> => {
  try {
    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData: AppUser = {
      userId: user.uid,
      email: user.email!,
      displayName,
      createdAt: new Date(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      ...userData,
      createdAt: new Date().toISOString(),
    });

    return userData;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

/**
 * Sign in existing user
 */
export const signIn = async (email: string, password: string): Promise<AppUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        userId: user.uid,
        email: user.email!,
        displayName: userData.displayName,
        createdAt: new Date(userData.createdAt),
        location: userData.location,
        notificationToken: userData.notificationToken,
      };
    } else {
      // If Firestore document doesn't exist, create it
      const userData: AppUser = {
        userId: user.uid,
        email: user.email!,
        displayName: user.displayName || email.split('@')[0],
        createdAt: new Date(),
      };

      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        ...userData,
        createdAt: new Date().toISOString(),
      });

      return userData;
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * Update user's notification token
 */
export const updateNotificationToken = async (userId: string, token: string): Promise<void> => {
  try {
    await setDoc(
      doc(db, COLLECTIONS.USERS, userId),
      { notificationToken: token },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating notification token:', error);
    throw error;
  }
};

/**
 * Update user's location
 */
export const updateUserLocation = async (
  userId: string,
  location: { latitude: number; longitude: number }
): Promise<void> => {
  try {
    await setDoc(
      doc(db, COLLECTIONS.USERS, userId),
      { location },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user location:', error);
    throw error;
  }
};

