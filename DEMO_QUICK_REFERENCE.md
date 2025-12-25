# PriceSnap - Demo Quick Reference Guide

## 🔐 Admin Credentials

**Email:** `admin@pricesnap.com`  
**Password:** `Admin123!`

## 📱 Testing Steps

### Before Demo:
1. Start expo: `cd PriceSnap && npx expo start --clear`
2. Open app on iPhone via Expo Go
3. Test admin login
4. Check if Firebase is working
5. Prepare a receipt image

### User Flow Demo:
1. ✅ Register/Login
2. ✅ Upload receipt
3. ✅ Review products (edit, delete, add)
4. ✅ Confirm save
5. ✅ Search for product
6. ✅ View product details
7. ✅ Get directions

### Admin Flow Demo:
1. ✅ Logout from user
2. ✅ Admin Access button
3. ✅ Login with admin credentials
4. ✅ View dashboard stats
5. ✅ Click on Products
6. ✅ View all products
7. ✅ Delete one product
8. ✅ Show backup option
9. ✅ Explain reset (DON'T execute!)

## 🎯 Key Features to Highlight

### User Features:
- Receipt OCR with Turkish support
- **Review screen** (unique feature!)
- Turkish Lira (₺) currency
- Real-time search
- Location-based sorting
- Google Maps navigation

### Admin Features:
- Real-time database statistics
- View all collections
- Delete individual records
- Backup to console
- Reset entire database
- Separate authentication

## 🔧 Troubleshooting

### If app won't start:
```bash
cd D:\CNG_project\PriceSnap
npx expo start --clear
```

### If Firebase errors:
- Check internet connection
- Verify firebaseConfig.ts has correct credentials
- Check Firebase console for service status

### If OCR not working:
- Ensure Cloud Vision API is enabled
- Check Cloud Functions are deployed
- View logs: `firebase functions:log`

### If admin won't login:
- Credentials: `admin@pricesnap.com` / `Admin123!`
- Check authStore.ts has loginAsAdmin function
- Try restarting app

## 📊 What to Show in Slides

### Slide 1: Title
- Project name: PriceSnap
- Your name: Abdulaty Ahmed
- Student ID: 2414506

### Slide 2-3: Problem & Solution
- Problem: Grocery prices vary
- Solution: Receipt scanning + price comparison

### Slide 4: Cloud Architecture
- SaaS: Mobile app
- PaaS: Firebase Functions
- IaaS: Firestore + Storage

### Slide 5: Features
List all features (user + admin)

### Slide 6: Tech Stack
React Native, Firebase, TypeScript, Google Cloud Vision

### Slide 7: Live Demo
**DO THE DEMO HERE**

### Slide 8: Database Design
Show 5 collections structure

### Slide 9: Code Stats
- 4,200 lines of code
- 16 weeks development
- 87 files

### Slide 10: Challenges
- Turkish receipt format → Custom parsing
- OCR accuracy → Review screen
- SDK issues → Upgraded to SDK 54

### Slide 11: Future Work
- Barcode scanning
- Price history
- Shopping lists
- Social features

### Slide 12: Thank You
- GitHub link
- Questions?

## ⏱️ Time Management

| Section | Time | Running Total |
|---------|------|---------------|
| Intro slides | 5 min | 5 min |
| User demo | 4 min | 9 min |
| Admin demo | 3 min | 12 min |
| Closing slides | 3 min | 15 min |

## 📝 Speaking Points

### Introduction:
"Good morning/afternoon. Today I'm presenting PriceSnap, a mobile app that helps shoppers save money by comparing grocery prices across different stores."

### Demo Transition:
"Now let me show you how it works. I'll first demonstrate the normal user flow, then show you the admin features."

### After User Demo:
"As you can see, the review screen is what makes this app special. Other receipt scanners just save whatever OCR detects, but PriceSnap lets users fix errors first."

### Admin Demo Intro:
"The app also includes a complete admin system for database management. Let me logout and login as an administrator."

### Conclusion:
"This project demonstrates all three cloud computing models - SaaS, PaaS, and IaaS - in a practical, real-world application. Thank you for your time. Are there any questions?"

## 🚨 Common Questions & Answers

**Q: How accurate is the OCR?**  
A: About 70-80% for Turkish receipts. The review screen lets users fix any mistakes.

**Q: Can users edit after uploading?**  
A: Not currently, but that's a planned future feature.

**Q: How is data secured?**  
A: Firestore security rules ensure users only access their own data. All communication is encrypted via HTTPS.

**Q: What happens if two stores have the same price?**  
A: Results are sorted by distance as a secondary factor, so closer stores appear first.

**Q: How long did this take?**  
A: About 16 weeks (4 months) of development.

**Q: What was the hardest part?**  
A: Handling Turkish receipt formats and dealing with multi-line product names.

## 📱 Phone Screen Mirror Setup

### For iOS (QuickTime):
1. Connect iPhone to Mac via cable
2. Open QuickTime Player
3. File → New Movie Recording
4. Click dropdown → Select iPhone
5. Show on projector

### For iOS (AirPlay):
1. iPhone Control Center
2. Screen Mirroring
3. Select Apple TV/Mac
4. Show on projector

### For Android (scrcpy):
1. Connect via USB
2. Enable USB debugging
3. Run: `scrcpy`
4. Show on projector

## ✅ Final Checklist

### Day Before:
- [ ] Test entire demo flow 3+ times
- [ ] Prepare backup screenshots
- [ ] Record backup video of app working
- [ ] Print this quick reference
- [ ] Charge all devices
- [ ] Download slides to USB drive

### Day Of:
- [ ] Laptop fully charged
- [ ] Phone fully charged
- [ ] All cables packed
- [ ] App working on phone
- [ ] Firebase services online
- [ ] Internet connection tested
- [ ] Screen mirroring tested
- [ ] Presentation file opened
- [ ] Water bottle ready

### During Setup:
- [ ] Connect laptop to projector
- [ ] Test screen mirroring
- [ ] Open presentation
- [ ] Open terminal (if needed)
- [ ] Open Firebase console (backup)
- [ ] Phone unlocked and ready

## 🎬 Demo Script

**[Start with slides 1-6]**

"Now let me show you the live demo."

**[Open phone, show home screen]**

"I'll start by creating a new user account..."

**[Register/Login]**

"Now I'm logged in. Let's upload a receipt..."

**[Navigate to Upload tab]**

"I'll select this receipt from my gallery, enter the store name, and upload..."

**[Wait for processing]**

"The app is now processing the receipt with Google Cloud Vision API..."

**[Review screen appears]**

"Here's the review screen - notice it detected these products, but there might be errors. Let me fix this one... and delete this incorrect entry... perfect."

**[Tap confirm]**

"Now the data is saved and anyone can search for it."

**[Go to Search]**

"Let's search for one of the products we just added..."

**[Show results]**

"Here are all the prices from different stores, sorted cheapest first, with distances."

**[Tap a product]**

"And here's the detailed view with store location and navigation."

"Now let me show you the admin features..."

**[Logout]**

**[Tap Admin Access]**

"Administrators have separate login credentials..."

**[Login as admin]**

"The admin dashboard shows live database statistics..."

**[Click on Products]**

"I can view all products in the database, see their details, and delete individual entries if needed..."

**[Go back]**

"The backup feature exports all data for safekeeping, and reset would clear the entire database - though I won't do that now!"

**[Return to slides]**

"That concludes the live demonstration. As you can see, the app provides value to both users and administrators."

---

**Good luck! 🎉 You got this! 💪**

