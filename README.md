# 📱 PriceSnap - Market Price Comparison App

**Developer:** Abdulaty Ahmed  
**Student ID:** 2414506  
**Course:** CNG 495 - Fall 2025

## Project Overview

PriceSnap is a mobile app that helps you save money on groceries. Take a photo of your receipt, and the app automatically extracts the products and prices. You can then search for products and compare prices across different stores near you to find the best deals.

I built this using React Native for the mobile app and Firebase for the backend. It's a complete cloud-based system that shows how SaaS, PaaS, and IaaS work together.

## What It Does

- **Receipt Scanning:** Take a photo of your receipt or upload one from your gallery
- **OCR Processing:** Uses Google Cloud Vision API to read the text from receipts
- **Product Search:** Search for products and see prices from different stores
- **Location Features:** GPS shows you which nearby stores have the cheapest prices
- **Product Images:** Automatically finds product images from OpenFoodFacts database
- **Price Alerts:** Get notified when prices drop at stores near you
- **Navigation:** Get directions to the store with the best price
- **User Accounts:** Sign up and log in to save your data

## Tech Stack

### Mobile App
- **React Native + Expo** - Build for both iOS and Android
- **TypeScript** - Makes the code more reliable
- **Zustand** - Handles app state
- **React Navigation** - Moving between screens

### Backend
- **Firebase Cloud Functions** - Runs code in the cloud without managing servers
- **Firebase Authentication** - Handles user sign-up and login
- **Node.js** - JavaScript runtime

### Database & Storage
- **Firestore** - Stores products, stores, and user data
- **Firebase Storage** - Stores receipt images
- **Google Cloud Vision API** - Reads text from receipt images

### Other Services
- **OpenFoodFacts API** - Gets product images
- **Google Maps API** - For location and directions
- **Expo Notifications** - Sends price alerts

## Cloud Architecture

This project demonstrates the three main cloud service models:

### SaaS (Software as a Service)
Users just download the app and use it. They don't worry about servers or infrastructure - everything works out of the box.

### PaaS (Platform as a Service)
I use Firebase to handle the backend without managing servers. Firebase automatically:
- Processes receipts using OCR
- Normalizes product names
- Fetches product images
- Validates data
- Triggers price alerts when needed

### IaaS (Infrastructure as a Service)
Google Cloud provides the underlying infrastructure:
- Database storage that scales automatically
- File storage for images
- Computing power that adjusts based on usage
- Fast content delivery worldwide
- Automatic backups

## Database Structure

Here's how I organized the data in Firestore:

### users
```typescript
{
  userId: string
  email: string
  displayName: string
  createdAt: timestamp
  location?: GeoPoint
  notificationToken?: string
}
```

### stores
```typescript
{
  storeId: string
  name: string
  location: GeoPoint
  address: string
  addedBy: string (userId)
  createdAt: timestamp
}
```

### products
```typescript
{
  productId: string
  name: string (normalized)
  originalName: string
  price: number
  storeId: string
  storeName: string
  storeLocation: GeoPoint
  imageUrl: string
  receiptId: string
  uploadedBy: string (userId)
  createdAt: timestamp
}
```

### receipts
```typescript
{
  receiptId: string
  imageUrl: string
  storeName: string
  storeLocation: GeoPoint
  uploadedBy: string (userId)
  processedAt: timestamp
  ocrText: string
  productCount: number
}
```

### searchLogs
```typescript
{
  searchId: string
  userId: string
  query: string
  timestamp: timestamp
  resultsCount: number
}
```

## 🏗️ Project Structure

```
PriceSnap/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ProductCard.tsx
│   │   └── ...
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── UploadReceiptScreen.tsx
│   │   └── ...
│   ├── navigation/          # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── AppNavigator.tsx
│   ├── store/               # Zustand state management
│   │   ├── authStore.ts
│   │   ├── searchStore.ts
│   │   └── uploadStore.ts
│   ├── services/            # API and Firebase services
│   │   ├── authService.ts
│   │   ├── storageService.ts
│   │   ├── cameraService.ts
│   │   ├── locationService.ts
│   │   ├── searchService.ts
│   │   └── ...
│   ├── utils/               # Helper functions
│   │   ├── validators.ts
│   │   └── distance.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── constants/           # App constants
│       ├── theme.ts
│       └── config.ts
├── functions/               # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── diagrams/                # System diagrams
│   ├── use-case-diagram.puml
│   ├── sequence-diagram.puml
│   ├── system-architecture-diagram.puml
│   └── firebase-data-flow-diagram.puml
├── docs/                    # Documentation
├── assets/                  # Images and fonts
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
├── firebase.json            # Firebase configuration
├── App.tsx                  # Root component
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

## Getting Started

### What You Need

- Node.js (version 18 or newer)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase account with billing enabled (needed for Cloud Vision API)
- An iPhone/Android phone with Expo Go, or an emulator

### Setup Instructions

1. **Get the code**
   ```bash
   cd PriceSnap
   ```

2. **Install packages**
   ```bash
   npm install
   ```

3. **Install Cloud Functions packages**
   ```bash
   cd functions
   npm install
   cd ..
   ```

4. **Set up Firebase**
   - Check [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) for details
   - Put your Firebase config in `src/services/firebaseConfig.ts`

5. **Start the app**
   ```bash
   npm start
   ```

6. **Run it**
   ```bash
   # iPhone
   npm run ios

   # Android
   npm run android
   ```

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it `pricesnap` (or whatever you want)
4. You can enable Google Analytics if you want
5. Create the project

### Step 2: Turn On the Services

**Authentication:**
1. Go to Authentication > Sign-in method
2. Enable "Email/Password"

**Firestore Database:**
1. Go to Firestore Database
2. Click "Create database"
3. Choose production mode
4. Pick a location close to where your users are

**Storage:**
1. Go to Storage
2. Click "Get started"
3. Choose production mode

**Cloud Functions:**
1. Upgrade to Blaze plan (you only pay for what you use)
2. Go to Functions section

**Cloud Vision API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Enable "Cloud Vision API"

### Step 3: Connect the App

1. In Firebase Console, go to Project Settings > General
2. Add a new Web app
3. Copy the config code
4. Paste it in `src/services/firebaseConfig.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Step 4: Deploy Security Rules

```bash
firebase login
firebase init
firebase deploy --only firestore:rules,storage
```

### Step 5: Deploy the Cloud Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

## How to Use

1. **Sign Up/Login**
   - Create an account with your email and password
   - Or log in if you already have one

2. **Upload a Receipt**
   - Tap the "Upload" tab
   - Take a photo or pick one from your gallery
   - Type the store name
   - Allow location access
   - Tap "Upload & Process"
   - Review the detected products and prices
   - Edit any mistakes and confirm

3. **Search for Products**
   - Tap the "Search" tab
   - Type what you're looking for
   - See results sorted by price or distance
   - Tap any product to see details

4. **Check Product Details**
   - View the product image, price, and store location
   - Tap "Get Directions" to navigate there

5. **Your Profile**
   - View your account info
   - Log out when you're done

## 🔐 Security

### Firestore Rules
- Users can only modify their own data
- All reads require authentication
- Data validation enforced at database level
- See `firestore.rules` for details

### Storage Rules
- Users can only upload to their own folders
- Images limited to 5MB
- Only image files allowed
- See `storage.rules` for details

### API Security
- Cloud Functions validate authentication
- Input sanitization and validation
- Rate limiting via Firebase quotas

## 🧪 Testing

### Local Testing

1. **Start Expo development server**
   ```bash
   npm start
   ```

2. **Test on device using Expo Go app**
   - Scan QR code with Expo Go
   - Test all features

3. **Test Cloud Functions locally**
   ```bash
   cd functions
   npm run serve
   ```

### Production Testing

1. Deploy to Firebase
2. Test with production data
3. Monitor Firebase Console for errors
4. Check Cloud Functions logs

## 📈 Performance Optimization

- **Image Compression:** Receipts compressed before upload
- **Lazy Loading:** Images loaded on demand
- **Debounced Search:** 500ms delay to reduce queries
- **Firestore Indexes:** Optimized for common queries
- **Caching:** React Navigation state persistence

## 📊 Diagrams

All system diagrams are located in the `diagrams/` folder:

1. **Use Case Diagram** - User interactions and system features
2. **Sequence Diagram** - Receipt upload and OCR processing flow
3. **System Architecture** - Complete system structure
4. **Firebase Data Flow** - Data movement through Firebase services

To generate PNG images from PlantUML files:
```bash
# Install PlantUML
npm install -g node-plantuml

# Generate diagrams
plantuml diagrams/*.puml
```

## 🚢 Deployment

### Build for Production

#### Android (APK)
```bash
expo build:android
```

#### iOS (IPA)
```bash
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

## Common Problems

**Firebase not working?**  
Check that you put the right config in `firebaseConfig.ts`

**OCR not reading receipts?**  
Make sure Cloud Vision API is enabled and you have billing turned on

**Camera won't open?**  
Go to your phone settings and allow camera access

**Location not working?**  
Turn on location permissions and make sure GPS is on

**No notifications?**  
Notifications only work on real phones, not emulators

## About This Project

This is my graduation project for CNG 495. I built PriceSnap to show how cloud computing works in a real app, specifically the three service models: SaaS, PaaS, and IaaS.

**Developer:** Abdulaty Ahmed  
**Student ID:** 2414506  
**Course:** CNG 495 - Fall 2025

## Credits

This project uses:
- Firebase for the backend
- Google Cloud Vision for reading receipts
- OpenFoodFacts for product images
- Expo for building the mobile app
- React Navigation for moving between screens
- Zustand for managing app state

Thanks to all these tools for making this project possible.

