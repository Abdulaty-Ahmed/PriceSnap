# 🚀 Deployment Guide for PriceSnap

This guide covers deploying PriceSnap to production for both the mobile app and Firebase backend.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Firebase Deployment](#firebase-deployment)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### ✅ Code Quality

- [ ] All features tested locally
- [ ] No console errors or warnings
- [ ] TypeScript compilation successful
- [ ] Security rules tested
- [ ] Cloud Functions tested locally

### ✅ Configuration

- [ ] Firebase config updated with production credentials
- [ ] API keys secured and restricted
- [ ] Environment variables configured
- [ ] app.json updated with correct bundle IDs

### ✅ Firebase Setup

- [ ] Blaze plan active
- [ ] All services enabled (Auth, Firestore, Storage, Functions)
- [ ] Cloud Vision API enabled
- [ ] Budget alerts configured

### ✅ Testing

- [ ] Authentication flow tested
- [ ] Receipt upload and OCR tested
- [ ] Product search tested
- [ ] Location services tested
- [ ] Notifications tested on physical device

## Firebase Deployment

### 1. Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage

# Verify in Firebase Console
```

### 2. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes

# Wait for indexes to build (check Firebase Console)
```

### 3. Build and Deploy Cloud Functions

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy functions
cd ..
firebase deploy --only functions

# Expected output:
# ✓  functions[processReceipt]: Successful create operation.
# ✓  functions[sendPriceAlerts]: Successful create operation.
```

### 4. Verify Functions Deployment

```bash
# List deployed functions
firebase functions:list

# Test function endpoint
firebase functions:log --only processReceipt
```

### 5. Set Up Function Environment Variables (if needed)

```bash
# Set environment variables for functions
firebase functions:config:set service.key="value"

# Example:
firebase functions:config:set openai.key="your-api-key"

# Deploy again to apply
firebase deploy --only functions
```

## Mobile App Deployment

### Option A: Expo Classic Build (Simpler)

#### Android APK

1. **Configure app.json**
   ```json
   {
     "expo": {
       "android": {
         "package": "com.abdulaty.pricesnap",
         "versionCode": 1
       }
     }
   }
   ```

2. **Build APK**
   ```bash
   expo build:android
   ```

3. **Select Build Type**
   - Choose: `APK` (for testing) or `App Bundle` (for Play Store)

4. **Download APK**
   - Build takes 10-20 minutes
   - Download link provided in terminal
   - Test APK on physical Android device

#### iOS IPA

1. **Apple Developer Account Required**
   - Enroll in Apple Developer Program ($99/year)
   - Create App ID in Apple Developer Portal

2. **Configure app.json**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.abdulaty.pricesnap",
         "buildNumber": "1.0.0"
       }
     }
   }
   ```

3. **Build IPA**
   ```bash
   expo build:ios
   ```

4. **Follow Prompts**
   - Provide Apple ID credentials
   - Select distribution certificate
   - Select provisioning profile

5. **Download IPA**
   - Build takes 15-25 minutes
   - Use for TestFlight or App Store submission

### Option B: EAS Build (Recommended)

EAS (Expo Application Services) is the modern Expo build system.

#### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login to Expo

```bash
eas login
```

#### 3. Configure EAS

```bash
eas build:configure
```

This creates `eas.json`:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

#### 4. Build for Android

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

#### 5. Build for iOS

```bash
# Development build
eas build --platform ios --profile development

# Production build (requires Apple Developer account)
eas build --platform ios --profile production
```

#### 6. Download and Test

```bash
# View builds
eas build:list

# Download build
# URL provided in terminal or Expo dashboard
```

### Publishing to App Stores

#### Google Play Store

1. **Create Google Play Developer Account**
   - $25 one-time fee
   - https://play.google.com/console

2. **Create App Listing**
   - App name: PriceSnap
   - Description: (copy from README)
   - Screenshots: Required (at least 2)
   - Feature graphic: 1024x500px
   - App icon: 512x512px

3. **Prepare Release**
   - Build App Bundle: `eas build --platform android --profile production`
   - Upload AAB file
   - Complete content rating questionnaire
   - Set pricing (Free)

4. **Submit for Review**
   - Review takes 1-7 days
   - Address any issues from review

#### Apple App Store

1. **App Store Connect**
   - Create new app
   - Bundle ID: com.abdulaty.pricesnap
   - SKU: pricesnap-001

2. **Prepare Metadata**
   - App name: PriceSnap
   - Subtitle: Smart Price Comparison
   - Description: (copy from README)
   - Keywords: price, shopping, receipt, scanner, deals
   - Screenshots: Required for all device sizes
   - App icon: 1024x1024px

3. **Build and Upload**
   ```bash
   # Build for App Store
   eas build --platform ios --profile production
   
   # Upload to TestFlight automatically
   # Or use Transporter app
   ```

4. **TestFlight Beta**
   - Internal testing: Up to 100 testers
   - External testing: Up to 10,000 testers
   - Beta review: 1-2 days

5. **Submit for Review**
   - Review takes 1-3 days
   - Be prepared for possible rejections
   - Common issues: permissions, functionality, content

## Over-The-Air (OTA) Updates

Expo allows publishing JavaScript updates without rebuilding:

```bash
# Publish update
expo publish

# Users receive update automatically on next app launch
```

**Note:** OTA updates only work for JavaScript changes, not native code changes.

## Environment-Specific Builds

### Development

```bash
# .env.development
FIREBASE_ENV=development
API_URL=http://localhost:5001
DEBUG=true
```

### Staging

```bash
# .env.staging
FIREBASE_ENV=staging
API_URL=https://staging-api.pricesnap.com
DEBUG=true
```

### Production

```bash
# .env.production
FIREBASE_ENV=production
API_URL=https://api.pricesnap.com
DEBUG=false
```

## CI/CD Pipeline (Advanced)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy PriceSnap

on:
  push:
    branches:
      - main

jobs:
  deploy-firebase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd functions && npm install
      
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions,firestore:rules,storage
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
  
  build-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Android
        run: eas build --platform android --non-interactive --no-wait
```

## Post-Deployment

### 1. Verify Deployment

#### Firebase Console
- [ ] Functions deployed and active
- [ ] Security rules updated
- [ ] Indexes built
- [ ] No errors in Functions logs

#### Mobile App
- [ ] Install production build
- [ ] Test complete user flow
- [ ] Verify all features work
- [ ] Check for crashes or errors

### 2. Monitor Application

```bash
# Monitor function logs in real-time
firebase functions:log --follow

# Check function performance
# Go to: Firebase Console → Functions → Usage
```

### 3. Set Up Monitoring

#### Firebase Performance Monitoring

1. Install SDK:
   ```bash
   expo install firebase
   ```

2. Enable in Firebase Console:
   - Go to Performance
   - Follow setup instructions

#### Crashlytics (Optional)

1. Enable in Firebase Console
2. Install SDK
3. Test crash reporting

### 4. Analytics Setup

```typescript
// In App.tsx
import analytics from '@react-native-firebase/analytics';

// Track screen views
analytics().logScreenView({
  screen_name: 'HomeScreen',
  screen_class: 'HomeScreen',
});

// Track events
analytics().logEvent('receipt_uploaded', {
  store_name: storeName,
  product_count: products.length,
});
```

### 5. Set Up Alerts

#### Cloud Monitoring

1. Go to Google Cloud Console → Monitoring
2. Create alert policies:
   - Function errors > 5 per minute
   - Function execution time > 30 seconds
   - Firestore errors > 10 per minute

#### Budget Alerts

1. Go to Billing → Budgets & alerts
2. Set monthly budget: $20 (adjust as needed)
3. Set alert thresholds: 50%, 90%, 100%

## Rollback Procedures

### Rollback Functions

```bash
# List function versions
firebase functions:list

# Delete current version
firebase functions:delete functionName

# Deploy previous version
git checkout previous-commit
firebase deploy --only functions
```

### Rollback Security Rules

```bash
# View rule history in Firebase Console
# Firestore → Rules → Rule history
# Storage → Rules → Rule history

# Restore previous version through console
```

### Rollback Mobile App

```bash
# Publish previous version via OTA
expo publish --release-channel production-rollback
```

## Performance Optimization

### 1. Function Optimization

```typescript
// Use function regions close to users
export const processReceipt = functions
  .region('us-central1')  // or 'europe-west1', 'asia-east1'
  .https.onCall(async (data, context) => {
    // Function code
  });

// Set appropriate memory and timeout
export const processReceipt = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .https.onCall(async (data, context) => {
    // Function code
  });
```

### 2. Firestore Optimization

- Use composite indexes for complex queries
- Implement pagination for large result sets
- Use batched writes for multiple documents
- Enable offline persistence in app

### 3. App Optimization

- Implement image caching
- Use React.memo for expensive components
- Lazy load screens with React.lazy
- Minimize bundle size

## Troubleshooting

### Functions Not Deploying

**Issue:** Deployment fails with timeout

**Solution:**
```bash
# Increase deployment timeout
firebase deploy --only functions --timeout 10m
```

### App Not Connecting to Firebase

**Issue:** "Firebase not initialized" error

**Solution:**
1. Verify firebaseConfig.ts has correct values
2. Rebuild app completely
3. Clear cache: `expo start -c`

### OTA Updates Not Working

**Issue:** Users not receiving updates

**Solution:**
1. Verify published to correct release channel
2. Check app.json `updates` configuration
3. Users must restart app to receive updates

### High Cloud Costs

**Issue:** Unexpected billing charges

**Solution:**
1. Check Functions logs for infinite loops
2. Review Firestore queries for inefficiencies
3. Implement caching to reduce API calls
4. Set up budget alerts

## Maintenance Schedule

### Daily
- Monitor Functions logs
- Check for crashes in Crashlytics
- Review error reports

### Weekly
- Review billing usage
- Check performance metrics
- Update dependencies if needed

### Monthly
- Security audit
- Performance optimization review
- User feedback review
- Plan updates and features

## Conclusion

Your PriceSnap application is now deployed and ready for production use! 🎉

Remember to:
- Monitor costs regularly
- Keep dependencies updated
- Respond to user feedback
- Maintain security best practices

For support, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

