# 📱 PriceSnap - Cloud Based Smart Market Price Comparison App

**Developer:** Abdulaty Ahmed  
**Student ID:** 2414506  
**Course:** CNG 495 - Fall 2025

## 🎯 Project Overview

PriceSnap is a production-ready, cross-platform mobile application that revolutionizes grocery shopping by allowing users to scan receipts, compare prices across stores, and find the best deals nearby. Built with React Native and Firebase, it demonstrates enterprise-level cloud computing architecture utilizing SaaS, PaaS, and IaaS delivery models.

## ✨ Key Features

- **📸 Receipt Scanning:** Capture or upload receipt images using device camera or gallery
- **🤖 OCR Processing:** Automated text extraction using Google Cloud Vision API
- **🔍 Smart Search:** Search products with real-time price comparison
- **📍 Location-Based:** Find cheapest prices at nearby stores using GPS
- **🖼️ Auto Image Fetch:** Automatically retrieves product images from OpenFoodFacts
- **🔔 Price Alerts:** Real-time notifications when prices drop nearby
- **🗺️ Navigation:** Get directions to stores with best prices
- **👤 User Profiles:** Secure authentication and personalized experience

## 🛠️ Technology Stack

### Frontend (SaaS)
- **React Native** with **Expo** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **Zustand** - Lightweight state management
- **React Navigation** - Screen navigation and routing

### Backend (PaaS)
- **Firebase Cloud Functions** - Serverless backend logic
- **Firebase Authentication** - User management
- **Node.js** - Runtime environment

### Database & Storage (IaaS)
- **Firestore** - NoSQL cloud database
- **Firebase Storage** - Receipt image storage
- **Google Cloud Vision API** - OCR processing

### External APIs
- **OpenFoodFacts API** - Product image retrieval
- **Google Maps API** - Location and navigation
- **Expo Notifications** - Push notifications

## 📊 Cloud Delivery Models

### 🟢 SaaS (Software as a Service)
Users access PriceSnap through mobile apps on iOS/Android without managing infrastructure.

**Features:**
- User registration and authentication
- Receipt upload and scanning
- Product search and comparison
- Price alerts and notifications
- Multi-platform accessibility

### 🟡 PaaS (Platform as a Service)
Firebase provides managed platform services for backend logic.

**Services:**
- Cloud Functions for OCR processing
- Automatic product name normalization
- Image retrieval from external APIs
- Data validation and storage
- Event-driven price alert triggers

### 🔵 IaaS (Infrastructure as a Service)
Google Cloud infrastructure handles scalable storage and compute.

**Resources:**
- Firestore for structured product data
- Cloud Storage for receipt images
- Auto-scaling compute resources
- Global CDN for fast access
- Automatic backups and redundancy

## 🗄️ Database Schema

### Collections Structure

#### **users**
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

#### **stores**
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

#### **products**
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

#### **receipts**
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

#### **searchLogs**
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

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI:** `npm install -g expo-cli`
- **Firebase CLI:** `npm install -g firebase-tools`
- **Firebase Account** with billing enabled (for Cloud Vision API)
- **iOS Simulator** or **Android Emulator** or physical device

### Installation

1. **Clone the repository**
   ```bash
   cd PriceSnap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Functions dependencies**
   ```bash
   cd functions
   npm install
   cd ..
   ```

4. **Configure Firebase**
   - See [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) for detailed instructions
   - Update `src/services/firebaseConfig.ts` with your Firebase credentials

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/emulator**
   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android
   ```

## 🔧 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `pricesnap`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Services

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password"

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location closest to users

#### Storage
1. Go to Storage
2. Click "Get started"
3. Start in **production mode**

#### Cloud Functions
1. Upgrade to Blaze (pay-as-you-go) plan
2. Go to Functions in Firebase Console

#### Cloud Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Enable "Cloud Vision API"
4. Create service account key (optional for local development)

### 3. Configure App

1. Go to Project Settings > General
2. Add a new app (Web)
3. Copy configuration object
4. Update `src/services/firebaseConfig.ts`:

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

### 4. Deploy Security Rules

```bash
firebase login
firebase init
firebase deploy --only firestore:rules,storage
```

### 5. Deploy Cloud Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

## 📱 Usage Guide

### For Users

1. **Register/Login**
   - Create account with email and password
   - Or sign in to existing account

2. **Upload Receipt**
   - Tap "Upload" tab
   - Capture photo or select from gallery
   - Enter store name
   - Enable location access
   - Tap "Upload & Process"

3. **Search Products**
   - Tap "Search" tab
   - Type product name
   - View results sorted by price or distance
   - Tap product for details

4. **View Product Details**
   - See product image, price, store location
   - Tap "Get Directions" for navigation

5. **Manage Profile**
   - View account information
   - Logout when needed

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

## 🐛 Troubleshooting

### Common Issues

**Issue:** Firebase not initialized
**Solution:** Verify `firebaseConfig.ts` has correct credentials

**Issue:** OCR not working
**Solution:** Ensure Cloud Vision API is enabled and billing is active

**Issue:** Camera not working
**Solution:** Grant camera permissions in device settings

**Issue:** Location not working
**Solution:** Grant location permissions and ensure GPS is enabled

**Issue:** Notifications not working
**Solution:** Test on physical device (not emulator)

## 📝 License

This project is created for educational purposes as part of CNG 495 course.

## 👨‍🎓 Author

**Abdulaty Ahmed**  
Student ID: 2414506  
Course: CNG 495 - Fall 2025

## 🙏 Acknowledgments

- Firebase for cloud infrastructure
- Google Cloud Vision for OCR
- OpenFoodFacts for product data
- Expo for React Native tooling
- React Navigation for routing
- Zustand for state management

## 📧 Contact

For questions or support regarding this project, please contact through course channels.

---

**Note:** This is a student project demonstrating cloud computing concepts including SaaS, PaaS, and IaaS delivery models with real-world application development practices.

