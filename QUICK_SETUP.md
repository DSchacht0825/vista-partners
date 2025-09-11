# 🚀 Quick Firebase Setup (2 minutes)

I've prepared your app for Firebase. Follow these steps to get your shared database working:

## Step 1: Create Firebase Project (1 minute)

1. Go to: **https://console.firebase.google.com/**
2. Click **"Create a project"**
3. Project name: `vista-partners-db`
4. Disable Google Analytics
5. Click **"Create project"**

## Step 2: Setup Database (30 seconds)

1. In your new project, click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"**
4. Select **"United States (nam5)"**
5. Click **"Enable"**

## Step 3: Get Your Config (30 seconds)

1. Click the **⚙️ gear icon** → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click **"</>** (Web app)"
4. App nickname: `Resource Database`
5. Click **"Register app"**
6. **Copy the firebaseConfig object**

## Step 4: Update Your App (30 seconds)

Replace the config in `src/firebase.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "paste-your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id", 
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## That's It! 🎉

Your database is now:
- ✅ **Shared** - Multiple people can edit
- ✅ **Real-time** - Changes sync instantly  
- ✅ **Cloud-based** - Accessible anywhere
- ✅ **Backed up** - Google handles storage
- ✅ **Free** - Firebase free tier is generous

## Quick Test:
1. Open your app in two browser tabs
2. Add an entry in one tab
3. Watch it appear in the other tab instantly!

## Deploy Your App:
```bash
npm run build
npx vercel --prod
```

Need help? The app works locally without Firebase too - it just won't be shared between users until you complete the setup.