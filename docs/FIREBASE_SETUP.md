# 🔥 Firebase Setup Guide for PriceSnap

This guide provides step-by-step instructions for setting up Firebase for the PriceSnap application.

## Prerequisites

- Google Account
- Credit card (for Firebase Blaze plan - required for Cloud Vision API)
- Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: **PriceSnap** (or your preferred name)
   - Project ID will be auto-generated (note this down)
   - Click "Continue"

3. **Google Analytics (Optional)**
   - Enable Google Analytics if desired
   - Select or create Analytics account
   - Click "Create project"
   - Wait for project creation (30-60 seconds)

## Step 2: Upgrade to Blaze Plan

**Important:** Cloud Vision API requires Blaze (pay-as-you-go) plan

1. Click the "Upgrade" button in Firebase Console
2. Select "Blaze Plan"
3. Add billing information
4. Set budget alerts (recommended: $10-$20/month)
5. Confirm upgrade

**Note:** Firebase provides generous free tier; typical usage for development won't exceed free limits.

## Step 3: Enable Firebase Services

### 3.1 Authentication

1. **Navigate to Authentication**
   - In left sidebar, click "Build" → "Authentication"
   - Click "Get started"

2. **Enable Email/Password Provider**
   - Click "Sign-in method" tab
   - Click "Email/Password"
   - Toggle "Enable" switch
   - Click "Save"

3. **Optional: Configure Email Templates**
   - Click "Templates" tab
   - Customize email verification and password reset templates

### 3.2 Firestore Database

1. **Navigate to Firestore Database**
   - In left sidebar, click "Build" → "Firestore Database"
   - Click "Create database"

2. **Security Rules**
   - Select "Start in production mode"
   - Click "Next"

3. **Location**
   - Choose a location closest to your target users
   - Recommended: `us-central1` or `europe-west1`
   - Click "Enable"

4. **Wait for Provisioning**
   - Database creation takes 1-2 minutes

### 3.3 Firebase Storage

1. **Navigate to Storage**
   - In left sidebar, click "Build" → "Storage"
   - Click "Get started"

2. **Security Rules**
   - Select "Start in production mode"
   - Click "Next"

3. **Location**
   - Use same location as Firestore
   - Click "Done"

### 3.4 Cloud Functions

1. **Navigate to Functions**
   - In left sidebar, click "Build" → "Functions"
   - Click "Get started"
   - Follow the setup wizard

2. **Note:** Functions deployment will be done via CLI later

## Step 4: Enable Google Cloud Vision API

1. **Open Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Select your Firebase project from dropdown

2. **Enable API**
   - Search for "Cloud Vision API" in search bar
   - Click on "Cloud Vision API"
   - Click "Enable"
   - Wait for API to be enabled

3. **Verify Billing**
   - Ensure project has billing enabled
   - Vision API requires active billing account

## Step 5: Configure Web App

1. **Add Web App to Project**
   - In Firebase Console, click gear icon → "Project settings"
   - Scroll to "Your apps" section
   - Click "Web" button (</> icon)

2. **Register App**
   - App nickname: **PriceSnap Web**
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy Configuration**
   - Copy the `firebaseConfig` object
   - It should look like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "pricesnap-xxxxx.firebaseapp.com",
     projectId: "pricesnap-xxxxx",
     storageBucket: "pricesnap-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

4. **Update PriceSnap Code**
   - Open `src/services/firebaseConfig.ts`
   - Replace placeholder values with your configuration:
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

## Step 6: Initialize Firebase CLI

1. **Login to Firebase**
   ```bash
   firebase login
   ```
   - This opens browser for authentication
   - Sign in with same Google account

2. **Initialize Firebase in Project**
   ```bash
   cd PriceSnap
   firebase init
   ```

3. **Select Features**
   - Use spacebar to select:
     - ☑ Firestore
     - ☑ Functions
     - ☑ Storage
   - Press Enter

4. **Select Existing Project**
   - Choose "Use an existing project"
   - Select your PriceSnap project from list

5. **Firestore Configuration**
   - Rules file: `firestore.rules` (default)
   - Indexes file: `firestore.indexes.json` (default)

6. **Functions Configuration**
   - Language: **TypeScript**
   - ESLint: **No** (or Yes if preferred)
   - Install dependencies: **Yes**

7. **Storage Configuration**
   - Rules file: `storage.rules` (default)

8. **Complete Initialization**
   - Press Enter to confirm
   - Wait for dependencies to install

## Step 7: Deploy Security Rules

1. **Review Rules**
   - Open `firestore.rules` - already configured for PriceSnap
   - Open `storage.rules` - already configured for PriceSnap

2. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Deploy Storage Rules**
   ```bash
   firebase deploy --only storage
   ```

4. **Verify Deployment**
   - Check Firebase Console → Firestore → Rules
   - Check Firebase Console → Storage → Rules

## Step 8: Deploy Cloud Functions

1. **Build Functions**
   ```bash
   cd functions
   npm run build
   ```

2. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```
   - This takes 3-5 minutes
   - Functions deployed:
     - `processReceipt` - HTTP callable
     - `sendPriceAlerts` - Firestore trigger

3. **Verify Deployment**
   - Check Firebase Console → Functions
   - Should see both functions listed
   - Note the function URLs

## Step 9: Create Firestore Indexes

**Note:** Indexes are automatically created from `firestore.indexes.json`

1. **Deploy Indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

2. **Verify in Console**
   - Go to Firestore → Indexes
   - Wait for indexes to build (can take a few minutes)

## Step 10: Test Configuration

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Test Authentication**
   - Register new user
   - Verify user appears in Authentication tab

3. **Test File Upload**
   - Upload a test image
   - Verify appears in Storage

4. **Test Cloud Functions**
   - Upload a receipt
   - Check Functions logs:
     ```bash
     firebase functions:log
     ```

5. **Test Firestore**
   - Verify data appears in Firestore Database

## Step 11: Configure Expo Notifications (Optional)

1. **Get Expo Project ID**
   - Run `expo start`
   - Note the project ID from Expo Dev Tools

2. **Add to app.json**
   ```json
   {
     "expo": {
       "extra": {
         "eas": {
           "projectId": "your-expo-project-id"
         }
       }
     }
   }
   ```

## Security Best Practices

### 1. API Key Restrictions

1. Go to Google Cloud Console → Credentials
2. Click on your API key
3. Under "Application restrictions":
   - iOS: Add iOS bundle ID
   - Android: Add Android package name and SHA-1
4. Under "API restrictions":
   - Restrict to: Cloud Vision API, Firebase APIs

### 2. Firebase App Check (Optional but Recommended)

1. Go to Firebase Console → App Check
2. Register your app
3. Enable App Check for:
   - Firestore
   - Storage
   - Cloud Functions

### 3. Environment Variables

For sensitive data, use environment variables:

```bash
# .env.local (don't commit to git)
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
```

## Monitoring and Maintenance

### 1. Set Up Alerts

1. **Budget Alerts**
   - Google Cloud Console → Billing → Budgets & alerts
   - Set monthly budget (e.g., $20)
   - Set alert thresholds (50%, 90%, 100%)

2. **Usage Quotas**
   - Monitor Firebase Console → Usage
   - Set up quota alerts

### 2. Monitor Functions

```bash
# View function logs
firebase functions:log

# View specific function
firebase functions:log --only processReceipt
```

### 3. Monitor Firestore

1. Go to Firestore → Usage tab
2. Monitor:
   - Document reads/writes
   - Storage usage
   - Network egress

## Troubleshooting

### Issue: "Permission Denied" Errors

**Solution:** Verify security rules are deployed correctly
```bash
firebase deploy --only firestore:rules,storage
```

### Issue: Cloud Functions Not Deploying

**Solution:**
1. Verify Blaze plan is active
2. Check functions code for syntax errors
3. Ensure `firebase.json` is configured correctly

### Issue: Vision API Not Working

**Solution:**
1. Verify Vision API is enabled in Google Cloud Console
2. Verify billing is active
3. Check function logs for specific error messages

### Issue: Authentication Errors

**Solution:**
1. Verify Email/Password is enabled
2. Check Firebase config in code
3. Ensure app is registered in Firebase Console

## Cost Estimation

### Free Tier Limits (Monthly)
- **Firestore:**
  - 50K document reads
  - 20K document writes
  - 20K document deletes
  - 1 GB storage

- **Storage:**
  - 5 GB stored
  - 1 GB downloaded per day

- **Cloud Functions:**
  - 2M invocations
  - 400K GB-seconds compute
  - 200K CPU-seconds compute

- **Cloud Vision API:**
  - 1,000 units per month free

### Typical Development Usage
- ~$5-10/month for active development
- ~$1-5/month for low-traffic production

## Next Steps

1. ✅ Complete all setup steps above
2. ✅ Test all features locally
3. ✅ Deploy security rules
4. ✅ Deploy cloud functions
5. ✅ Build and test mobile app
6. ✅ Monitor usage and costs

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Vision API Docs](https://cloud.google.com/vision/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Support](https://firebase.google.com/support)

---

**Setup Complete!** 🎉

Your Firebase backend is now fully configured for PriceSnap. You can now run the mobile app and test all features.

