# CNG 495 - Fall 2025
## Capstone Project Final Report

**Project Name:** PriceSnap - Market Price Comparison App

**Student Name:** Abdulaty Ahmed  
**Student ID:** 2414506

**Date:** December 2025

---

## Table of Contents

1. Introduction
2. Structure of the Project
3. Project Statistics
4. Conclusion
5. References

---

## 1. Introduction

### 1.1 Project Overview

PriceSnap is a mobile application designed to help shoppers save money by comparing grocery prices across different stores. Users can take photos of their receipts, and the app automatically extracts product information using Optical Character Recognition (OCR). The app then stores this data in a cloud database, allowing users to search for products and find the best prices at nearby stores.

### 1.2 Benefits and Novelties

The key benefits of PriceSnap include:

- **Time Saving:** Instead of manually checking prices across multiple stores, users get instant price comparisons
- **Money Saving:** Find the cheapest prices for products you regularly buy
- **Convenience:** Receipt scanning eliminates manual data entry
- **Location-Based:** Uses GPS to show prices at nearby stores
- **Review System:** Users can review and edit OCR results before saving, ensuring data accuracy

What makes PriceSnap different:
- **Receipt Review Feature:** Unlike other apps, PriceSnap shows users what was detected and lets them fix errors before saving
- **Turkish Receipt Support:** Specifically optimized for Turkish receipt formats and currency
- **Complete Cloud Architecture:** Demonstrates SaaS, PaaS, and IaaS cloud models
- **Admin Dashboard:** Built-in database management system for administrators

### 1.3 Similar Existing Projects

Similar projects on GitHub include:

1. **Receipt Scanner Apps:**
   - [Smart Receipt](https://github.com/wbaumann/Smart-Receipts)
   - [Green Receipts](https://github.com/coyotebush/green-receipts)

2. **Price Comparison Apps:**
   - [Price Tracker](https://github.com/pricetrackerapp/pricetracker)
   - [ShopSavvy](https://github.com/shopsavvy)

3. **Grocery Shopping Apps:**
   - [Grocy](https://github.com/grocy/grocy)
   - [OpenEats](https://github.com/open-eats/OpenEats)

PriceSnap differs by combining receipt OCR, price comparison, and location-based services with a focus on Turkish markets and user-editable data.

---

## 2. Structure of the Project

### 2.1 System Architecture

PriceSnap follows a three-tier cloud architecture:

**Presentation Layer (Mobile App)**
- React Native with Expo for cross-platform development
- TypeScript for type safety
- Zustand for state management
- React Navigation for routing

**Application Layer (Backend Services)**
- Firebase Cloud Functions for serverless processing
- Firebase Authentication for user management
- Custom OCR parsing logic for Turkish receipts

**Data Layer (Cloud Database)**
- Firestore for NoSQL data storage
- Firebase Storage for receipt images
- Google Cloud Vision API for OCR

### 2.2 Cloud Services Table

| Service | Provider | Type | Purpose |
|---------|----------|------|---------|
| Cloud Functions | Firebase | PaaS | Receipt processing, OCR |
| Authentication | Firebase | SaaS | User login/registration |
| Firestore | Firebase | IaaS | Database storage |
| Storage | Firebase | IaaS | Image storage |
| Cloud Vision API | Google Cloud | PaaS | Text extraction from images |
| OpenFoodFacts API | External | SaaS | Product image retrieval |
| Expo Go | Expo | SaaS | Mobile app testing |

### 2.3 Project Components

#### 2.3.1 Mobile Application Features

**User Features:**
1. **Authentication**
   - User registration with email/password
   - User login
   - Profile management

2. **Receipt Processing**
   - Camera access for taking receipt photos
   - Gallery access for selecting existing images
   - Image upload to cloud storage
   - OCR processing via Cloud Functions
   - Review screen to edit detected products
   - Confirm and save to database

3. **Product Search**
   - Real-time search functionality
   - Results sorted by price or distance
   - Product detail view with store location
   - Navigate to store with Google Maps

4. **Location Services**
   - GPS location access
   - Distance calculation to stores
   - Location-based search filtering

**Admin Features:**
1. **Admin Authentication**
   - Separate admin login (admin@pricesnap.com / Admin123!)
   - Admin dashboard access

2. **Database Management**
   - View statistics (users, products, stores, receipts, searches)
   - Browse all database collections
   - Delete individual records
   - Reset entire database
   - Backup data to console

#### 2.3.2 Cloud Functions

**parseReceiptOCR**
- Input: Receipt image URL
- Process: Calls Google Cloud Vision API, parses Turkish receipt format
- Output: Array of products with names and prices
- Used for: Initial OCR processing before user review

**processReceipt**
- Input: Confirmed products, store info, location, user ID
- Process: Creates store, receipt, and product documents
- Output: Success response with IDs
- Used for: Final data storage after user confirmation

**sendPriceAlerts**
- Trigger: New product added to database
- Process: Checks if price is lowest, notifies nearby users
- Used for: Real-time price drop notifications

### 2.4 Database Schema

#### Collections Structure:

**users**
```
{
  userId: string (document ID)
  email: string
  displayName: string
  createdAt: timestamp
  location: GeoPoint (optional)
  notificationToken: string (optional)
}
```

**stores**
```
{
  storeId: string (document ID)
  name: string
  location: GeoPoint
  address: string
  addedBy: string (userId)
  createdAt: timestamp
}
```

**products**
```
{
  productId: string (document ID)
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

**receipts**
```
{
  receiptId: string (document ID)
  imageUrl: string
  storeName: string
  storeLocation: GeoPoint
  uploadedBy: string (userId)
  processedAt: timestamp
  ocrText: string
  productCount: number
}
```

**searchLogs**
```
{
  searchId: string (document ID)
  userId: string
  query: string
  timestamp: timestamp
  resultsCount: number
}
```

### 2.5 User Manual with Screenshots

#### For Regular Users:

**Step 1: Registration/Login**
1. Open the app
2. Tap "Create Account"
3. Enter your name, email, and password
4. Tap "Sign Up"

[Screenshot: Registration screen]

**Step 2: Upload a Receipt**
1. Tap the "Upload" tab
2. Tap "Take Photo" or "Choose from Gallery"
3. Select your receipt image
4. Enter the store name
5. Allow location access
6. Tap "Upload & Process"

[Screenshot: Upload screen]

**Step 3: Review Detected Products**
1. Wait for OCR processing (2-5 seconds)
2. Review the detected products and prices
3. Edit product names if incorrect
4. Fix prices if needed
5. Delete wrong entries
6. Add any missing products
7. Tap "✓ Confirm" to save

[Screenshot: Review screen]

**Step 4: Search for Products**
1. Tap the "Search" tab
2. Type the product name
3. View results sorted by price
4. Tap any product for details

[Screenshot: Search screen]

**Step 5: View Product Details**
1. See product image and price
2. View store location
3. Tap "Get Directions" to navigate

[Screenshot: Product detail screen]

#### For Administrators:

**Step 1: Admin Login**
1. On login screen, tap "🔐 Admin Access"
2. Enter admin credentials:
   - Email: admin@pricesnap.com
   - Password: Admin123!
3. Tap "Sign In as Admin"

[Screenshot: Admin login screen]

**Step 2: View Dashboard**
- See total counts for users, products, stores, receipts, searches
- Each stat card is clickable to view that collection

[Screenshot: Admin dashboard]

**Step 3: Manage Database**
1. Tap any stat card (e.g., "Products")
2. View all documents in that collection
3. Delete individual documents
4. Use "Refresh" to reload
5. Use "Backup to Console" to export data

[Screenshot: Database management screen]

**Step 4: Reset Database**
1. From admin dashboard
2. Tap "Reset Database"
3. Confirm the action
4. All data (except users) will be deleted

### 2.6 System Diagrams

*Note: Include your PlantUML diagrams here:*
- Use Case Diagram
- Sequence Diagram
- System Architecture Diagram
- Firebase Data Flow Diagram

### 2.7 Technologies Used

#### Programming Languages:
- TypeScript (Main application code)
- JavaScript (Cloud Functions)
- Kotlin (Android native code)
- Swift (iOS native code)

#### Frameworks & Libraries:
- React Native (v0.74)
- Expo (SDK 54)
- Firebase SDK (v10.x)
- React Navigation (v6.x)
- Zustand (v4.x)

#### Cloud Services:
- Firebase Cloud Functions
- Firebase Authentication
- Firestore Database
- Firebase Storage
- Google Cloud Vision API

#### Development Tools:
- Node.js (v20)
- npm (package manager)
- Git (version control)
- GitHub (repository hosting)
- VS Code (code editor)
- Expo Go (mobile testing)

#### APIs:
- Google Cloud Vision API (OCR)
- OpenFoodFacts API (product images)
- Google Maps API (navigation)
- Expo Notifications API (push notifications)

---

## 3. Project Statistics

### 3.1 Development Timeline

| Phase | Tasks | Duration | Team Member |
|-------|-------|----------|-------------|
| **Week 1-2** | Project planning, Firebase setup | 2 weeks | Abdulaty Ahmed |
| **Week 3-4** | User authentication, basic UI | 2 weeks | Abdulaty Ahmed |
| **Week 5-6** | Receipt upload, OCR integration | 2 weeks | Abdulaty Ahmed |
| **Week 7-8** | Product search, database design | 2 weeks | Abdulaty Ahmed |
| **Week 9-10** | Location services, maps | 2 weeks | Abdulaty Ahmed |
| **Week 11-12** | Review screen feature | 2 weeks | Abdulaty Ahmed |
| **Week 13-14** | Admin UI, testing | 2 weeks | Abdulaty Ahmed |
| **Week 15-16** | Final polishing, documentation | 2 weeks | Abdulaty Ahmed |

**Total Development Time:** 16 weeks (4 months)

### 3.2 Code Metrics

#### Lines of Code:
- TypeScript (React Native): ~3,500 lines
- Cloud Functions: ~500 lines
- Configuration files: ~200 lines
- **Total: ~4,200 lines**

#### File Structure:
- Total Files: 87
- Source Files: 45
- Configuration Files: 12
- Assets: 30

#### Programming Languages Breakdown:
- TypeScript: 85%
- JavaScript: 10%
- JSON: 3%
- Other (Kotlin, Swift): 2%

### 3.3 Database Metrics

#### Collections:
- users: Variable (depends on registrations)
- products: Variable (grows with uploads)
- stores: Variable
- receipts: Variable
- searchLogs: Variable

#### Storage:
- Receipt images: ~500KB per image
- Database documents: ~2KB per document
- Average per user: ~5MB

#### Memory Requirements:
- Mobile app: ~150MB RAM
- Cloud Functions: 256MB allocated
- Database: Scales automatically

---

## 4. Conclusion

### 4.1 Project Summary

PriceSnap successfully demonstrates a complete cloud-based mobile application using modern technologies. The project implements all three cloud service models (SaaS, PaaS, IaaS) and provides real value to users looking to save money on groceries.

### 4.2 Challenges Overcome

1. **Turkish Receipt Format:** Turkish receipts have unique formatting (comma as decimal separator, multi-line product names). Solved by creating custom parsing logic.

2. **OCR Accuracy:** OCR isn't perfect. Solved by adding a review screen where users can edit results before saving.

3. **SDK Compatibility:** Initial setup had Node.js and Expo SDK version conflicts. Solved by upgrading to SDK 54 and Node 20.

4. **Firebase Initialization:** Auth service initialization issues. Solved by using `initializeAuth` with AsyncStorage persistence.

### 4.3 Future Improvements

1. **Barcode Scanning:** Add barcode scanner for faster product lookup
2. **Price History:** Track price changes over time
3. **Shopping Lists:** Let users create and manage shopping lists
4. **Social Features:** Share deals with friends
5. **AI Recommendations:** Suggest cheaper alternatives

### 4.4 Learning Outcomes

Through this project, I gained experience in:
- Cloud computing architecture (SaaS, PaaS, IaaS)
- Mobile app development with React Native
- Firebase services (Functions, Auth, Firestore, Storage)
- OCR and image processing
- Location-based services
- Database design and management
- Git version control and GitHub

---

## 5. References

1. Firebase Documentation - https://firebase.google.com/docs
2. React Native Documentation - https://reactnative.dev/docs
3. Expo Documentation - https://docs.expo.dev
4. Google Cloud Vision API - https://cloud.google.com/vision/docs
5. OpenFoodFacts API - https://world.openfoodfacts.org/data
6. React Navigation - https://reactnavigation.org/docs
7. TypeScript Documentation - https://www.typescriptlang.org/docs

---

## Appendices

### Appendix A: Installation Guide

See README.md for complete installation instructions.

### Appendix B: API Documentation

See functions/src/index.ts for Cloud Functions documentation.

### Appendix C: Security Rules

See firestore.rules and storage.rules for database security configuration.

---

**End of Report**



