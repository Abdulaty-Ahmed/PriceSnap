# 🚀 PriceSnap Quick Start Guide

Get PriceSnap up and running in 15 minutes!

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (v18+): [Download here](https://nodejs.org/)
- ✅ **npm** or **yarn**: Comes with Node.js
- ✅ **Expo Go app** on your phone: [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- ✅ **Google Account**: For Firebase
- ✅ **Credit Card**: For Firebase Blaze plan (free tier available)

## Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project
cd PriceSnap

# Install main dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..

# Install Expo CLI globally
npm install -g expo-cli firebase-tools
```

## Step 2: Firebase Setup (5 minutes)

### Create Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name: `PriceSnap`
4. Click through wizard
5. Upgrade to Blaze plan (required for Cloud Vision)

### Enable Services

1. **Authentication**
   - Click "Authentication" → "Get Started"
   - Enable "Email/Password"

2. **Firestore**
   - Click "Firestore Database" → "Create Database"
   - Start in production mode
   - Choose location (e.g., us-central1)

3. **Storage**
   - Click "Storage" → "Get Started"
   - Start in production mode

4. **Cloud Vision API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your Firebase project
   - Enable "Cloud Vision API"

### Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (</>) to add web app
4. Copy the `firebaseConfig` object

## Step 3: Configure App (2 minutes)

Open `src/services/firebaseConfig.ts` and replace:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Replace with yours
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## Step 4: Deploy Firebase (3 minutes)

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# When prompted, select:
# - Firestore
# - Functions
# - Storage

# Use existing project: Select your PriceSnap project

# Deploy security rules and functions
firebase deploy --only firestore:rules,storage,functions
```

Wait 2-3 minutes for deployment to complete.

## Step 5: Run the App (3 minutes)

```bash
# Start Expo development server
npm start
```

This opens Expo Dev Tools in your browser.

### Option A: Run on Your Phone (Easiest)

1. Open **Expo Go** app on your phone
2. Scan the QR code shown in terminal/browser
3. App will load on your phone
4. ✅ Done!

### Option B: Run on Emulator

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
npm run ios
```

## Step 6: Test the App

### Create Account
1. App opens to Login screen
2. Tap "Create Account"
3. Enter email, password, name
4. Tap "Create Account"
5. ✅ You're logged in!

### Test Receipt Upload
1. Tap "Upload" tab
2. Tap "Gallery" button
3. Select any receipt image (or take photo)
4. Enter store name (e.g., "Walmart")
5. Tap "Get Current Location"
6. Tap "Upload & Process"
7. ✅ Wait 10-15 seconds for OCR processing

### Test Product Search
1. Tap "Search" tab
2. Type any product name (e.g., "milk")
3. View results with prices
4. Tap a product to see details
5. ✅ Search working!

## Common Issues

### ❌ "Firebase not initialized"
**Fix:** Check `firebaseConfig.ts` has correct values from Firebase Console

### ❌ "Permission denied" in Firestore
**Fix:** Run `firebase deploy --only firestore:rules`

### ❌ Cloud Functions not working
**Fix:** 
1. Verify Blaze plan is active
2. Check Vision API is enabled
3. Run `firebase functions:log` to see errors

### ❌ Camera not working
**Fix:** 
- Grant camera permission in phone settings
- Try using "Gallery" instead

### ❌ Location not working
**Fix:**
- Grant location permission in phone settings
- Ensure GPS is enabled

## What's Next?

🎉 **Congratulations!** PriceSnap is running!

### Next Steps:

1. **Read Full Documentation**
   - [README.md](../README.md) - Complete project overview
   - [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Detailed Firebase guide
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

2. **Explore Features**
   - Upload multiple receipts
   - Search different products
   - Check price comparisons
   - Test location-based sorting

3. **Customize**
   - Modify UI in `src/components/`
   - Add new features
   - Improve OCR accuracy
   - Add more stores

4. **Deploy to Production**
   - Build Android APK: `expo build:android`
   - Build iOS IPA: `expo build:ios`
   - Publish to app stores

## Architecture Overview

```
┌─────────────────┐
│   Mobile App    │  ← React Native + Expo
│   (Frontend)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Firebase     │  ← Backend Services
│  Cloud Platform │
├─────────────────┤
│ • Authentication│  ← User login/register
│ • Cloud Functions│  ← OCR processing
│ • Firestore DB  │  ← Data storage
│ • Storage       │  ← Image storage
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  External APIs  │
├─────────────────┤
│ • Google Vision │  ← OCR text extraction
│ • OpenFoodFacts │  ← Product images
│ • Google Maps   │  ← Directions
└─────────────────┘
```

## Support

### Resources
- 📖 [Full Documentation](../README.md)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- 📱 [Expo Docs](https://docs.expo.dev/)
- ⚛️ [React Native Docs](https://reactnative.dev/)

### Troubleshooting
- Check `firebase functions:log` for Cloud Function errors
- Use Expo Dev Tools console for app errors
- Review Firebase Console for service status

---

**Need Help?** Check the detailed guides in the `docs/` folder!

Happy coding! 🚀

