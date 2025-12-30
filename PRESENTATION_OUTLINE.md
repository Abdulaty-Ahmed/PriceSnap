# PriceSnap - Final Demonstration Presentation
## 15-Minute Presentation Outline

**Presenter:** Abdulaty Ahmed  
**Student ID:** 2414506  
**Course:** CNG 495 - Fall 2025

---

## Slide Structure (15 minutes total)

### Slide 1: Title Slide (30 seconds)
**Content:**
- Project Name: PriceSnap
- Subtitle: Market Price Comparison App
- Your Name & Student ID
- Course: CNG 495 - Fall 2025
- Date

---

### Slide 2: Problem Statement (1 minute)
**Content:**
- Grocery shopping is expensive
- Prices vary significantly between stores
- Manually checking prices is time-consuming
- No easy way to compare historical prices

**What to Say:**
"Shopping for groceries can be frustrating when you don't know if you're getting the best price. PriceSnap solves this by letting users scan receipts and instantly compare prices across nearby stores."

---

### Slide 3: Solution Overview (1 minute)
**Content:**
- Mobile app for iOS and Android
- Scan receipts with your phone
- Automatic OCR processing
- Search and compare prices
- Find cheapest nearby stores

**What to Say:**
"PriceSnap is a mobile app that uses your phone's camera to scan receipts, automatically extracts the products and prices, and builds a database that everyone can search to find the best deals nearby."

---

### Slide 4: Cloud Architecture (2 minutes)
**Content:**
- Diagram showing three layers
- **SaaS:** Users access the mobile app
- **PaaS:** Firebase handles backend processing
- **IaaS:** Google Cloud provides infrastructure

**What to Say:**
"The project demonstrates all three cloud service models. Users interact with the app as a service. Firebase provides the platform for running our backend code. And Google Cloud provides the underlying infrastructure that scales automatically."

---

### Slide 5: Key Features (1 minute)
**Content:**
Bullet list:
- 📸 Receipt Scanning (OCR)
- ✏️ Review & Edit Results
- 🔍 Product Search
- 📍 Location-Based Prices
- 👤 User Accounts
- ⚙️ Admin Dashboard

**What to Say:**
"The app has features for both regular users and administrators. Users can scan receipts, review the results, search for products, and find the best prices nearby. Admins can manage the entire database."

---

### Slide 6: Technology Stack (1 minute)
**Content:**
Table format:
| Layer | Technology |
|-------|------------|
| Frontend | React Native, TypeScript |
| Backend | Firebase Cloud Functions |
| Database | Firestore (NoSQL) |
| Storage | Firebase Storage |
| OCR | Google Cloud Vision API |
| Auth | Firebase Authentication |

**What to Say:**
"I built this using React Native for the mobile app, Firebase for the backend services, and Google Cloud Vision for reading receipt text."

---

### LIVE DEMO SECTION (7-8 minutes)

### Demo Part 1: Normal User Flow (4 minutes)

#### 1. Registration/Login (30 seconds)
**What to Show:**
- Open app
- Show registration screen
- Register a new user OR login with existing account

**What to Say:**
"Let me start by creating a new account. Users register with their email and password, which is handled securely by Firebase Authentication."

#### 2. Upload Receipt (1 minute)
**What to Show:**
- Navigate to Upload tab
- Take photo or select from gallery
- Enter store name
- Allow location access
- Tap "Upload & Process"

**What to Say:**
"Now I'll upload a receipt. The app needs the store name and location. When I tap upload, it sends the image to Firebase Storage and calls a Cloud Function to process it."

#### 3. Review Products (1.5 minutes)
**What to Show:**
- Wait for OCR to complete
- Show the review screen with detected products
- Edit a product name
- Fix a price
- Delete a wrong entry
- Add a missing product
- Tap Confirm

**What to Say:**
"This is the key feature - the review screen. The OCR detected these products, but it's not perfect. I can edit the names, fix prices, delete mistakes, and add anything it missed. This ensures the data is accurate before it goes into the database."

#### 4. Search Products (1 minute)
**What to Show:**
- Navigate to Search tab
- Type a product name
- Show results sorted by price
- Tap on a product
- Show product details with store location
- Tap "Get Directions"

**What to Say:**
"Now anyone can search for products. The results show the price at each store, sorted from cheapest to most expensive, along with how far away the store is. Tapping a product shows details and you can get directions to the store."

---

### Demo Part 2: Admin Features (3 minutes)

#### 1. Admin Login (30 seconds)
**What to Show:**
- Logout from user account
- On login screen, tap "Admin Access"
- Enter admin credentials (admin@pricesnap.com / Admin123!)
- Login

**What to Say:**
"The app also has a complete admin system. Let me logout and login as an administrator."

#### 2. Admin Dashboard (1 minute)
**What to Show:**
- Show dashboard with statistics
- Point out user count, product count, store count, etc.
- Explain each stat

**What to Say:**
"The admin dashboard shows real-time statistics from the database - how many users, products, stores, receipts, and searches we have. Each of these cards is clickable to view that collection."

#### 3. Database Management (1.5 minutes)
**What to Show:**
- Tap on "Products" card
- Show list of all products
- Scroll through some entries
- Delete a product
- Go back to dashboard
- Tap "Backup to Console" - explain
- Tap "Reset Database" - explain but DON'T execute!

**What to Say:**
"Clicking on any stat takes you to database management. I can see all documents in that collection, view their details, and delete individual entries if needed. The backup feature exports all data to the console for safekeeping. The reset button would delete everything - useful for testing but dangerous in production, which is why it asks for confirmation."

---

### Slide 7: Database Design (1 minute)
**Content:**
Show schema diagram or list collections:
- users (user profiles)
- products (product + price + store)
- stores (store locations)
- receipts (uploaded receipts)
- searchLogs (search analytics)

**What to Say:**
"The database is organized into five collections. Products link to stores through IDs, and receipts track which user uploaded what. This structure allows efficient queries for price comparisons."

---

### Slide 8: Code Statistics (30 seconds)
**Content:**
- Total Lines: ~4,200
- Development Time: 16 weeks
- Languages: TypeScript (85%), JavaScript (10%), Other (5%)
- Files: 87 total

**What to Say:**
"The project took about 4 months to complete, with over 4,000 lines of code across 87 files."

---

### Slide 9: Challenges & Solutions (1 minute)
**Content:**
Table:
| Challenge | Solution |
|-----------|----------|
| Turkish receipt format | Custom parsing logic |
| OCR accuracy | Review screen for corrections |
| SDK compatibility | Upgraded to SDK 54 |

**What to Say:**
"The biggest challenge was handling Turkish receipt formats, which use commas instead of periods for decimals. I solved this with custom parsing. Since OCR isn't perfect, I added the review screen so users can fix mistakes before saving."

---

### Slide 10: Future Improvements (30 seconds)
**Content:**
- Barcode scanning
- Price history graphs
- Shopping list feature
- Social sharing
- AI recommendations

**What to Say:**
"Future improvements could include barcode scanning for faster lookup, price history tracking, shopping lists, and AI-powered recommendations for cheaper alternatives."

---

### Slide 11: Thank You / Questions (30 seconds)
**Content:**
- Thank You!
- Questions?
- GitHub: github.com/Abdulaty-Ahmed/PriceSnap
- Email: [your email]

**What to Say:**
"Thank you for watching. The complete code is available on my GitHub. I'm happy to answer any questions."

---

## Presentation Tips

### Before the Demo:
1. **Test everything** - Run through the demo at least 3 times
2. **Prepare test data** - Have a receipt image ready
3. **Clear old data** - Use admin reset if needed
4. **Check internet** - Make sure WiFi/data is working
5. **Charge devices** - Phone and laptop fully charged
6. **Have backup** - Screenshots of each screen in case of technical issues

### During the Demo:
1. **Speak clearly and slowly**
2. **Show the screen to the camera/audience**
3. **Explain what you're doing before you do it**
4. **Don't rush** - 15 minutes is plenty of time
5. **If something fails** - Have backup screenshots

### Common Questions to Prepare For:
1. **Q:** How accurate is the OCR?
   **A:** About 70-80% accurate, which is why we have the review screen.

2. **Q:** How do you handle privacy?
   **A:** Each user can only see their own uploads. Firestore rules enforce this.

3. **Q:** What if two stores have the same price?
   **A:** Results sort by distance as a secondary factor.

4. **Q:** Can users edit products after uploading?
   **A:** Currently no, but that would be a good future feature.

5. **Q:** How does the admin login work?
   **A:** It's a hardcoded credential for demonstration purposes. In production, this would use role-based access control.

6. **Q:** What cloud services does this use?
   **A:** Firebase (PaaS) for backend, Google Cloud (IaaS) for infrastructure, and the app itself is SaaS.

---

## Time Breakdown

- Slides 1-6: 7 minutes
- Live Demo User Flow: 4 minutes
- Live Demo Admin Flow: 3 minutes
- Slides 7-11: 3.5 minutes
- **Total: ~17.5 minutes** (gives you buffer time)

---

## Equipment Checklist

- [ ] Laptop with presentation loaded
- [ ] iPhone/Android phone with app installed
- [ ] HDMI/USB-C cable for projector
- [ ] Phone cable for screen mirroring
- [ ] Backup: Screenshots of each screen
- [ ] Backup: Screen recording video
- [ ] Notes with talking points
- [ ] Water bottle

---

Good luck with your presentation! 🎉



