# Firebase Setup Instructions

Your app is now configured to use Firebase Firestore as a shared database that multiple people can edit simultaneously.

## Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `vista-partners-db`
4. Disable Google Analytics (not needed)
5. Click "Create Project"

### Step 2: Create Firestore Database
1. In your Firebase project, click "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in test mode" (for easy setup)
4. Select location: `nam5 (United States)`
5. Click "Enable"

### Step 3: Get Your Config
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click the "</>" (Web) icon
4. Register app with nickname: `Resource Database`
5. Copy the firebaseConfig object

### Step 4: Update Your App
Replace the config in `src/firebase.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 5: Set Security Rules (Important!)
1. Go to Firestore Database → Rules
2. Replace with these rules for basic security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resources/{document} {
      // Anyone can read
      allow read: if true;
      // Anyone can write (change this for production)
      allow write: if true;
    }
  }
}
```

For production, consider adding authentication:
```javascript
// Only authenticated users can write
allow write: if request.auth != null;
```

## That's It! 🎉

Your database is now:
- ✅ Shared across all users
- ✅ Real-time syncing
- ✅ Accessible from anywhere
- ✅ Automatically backs up data
- ✅ Works offline and syncs when back online

## Share With Your Team

Once set up, anyone accessing your deployed app will:
- See the same data
- See real-time updates when others make changes
- Be able to add, edit, and delete entries

## Deploy Your App

To make it accessible online:

```bash
npm run build
npx vercel
```

Or use Netlify:
1. Run `npm run build`
2. Drag the `build` folder to [Netlify](https://app.netlify.com/drop)

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [React + Firebase Tutorial](https://firebase.google.com/docs/firestore/quickstart)