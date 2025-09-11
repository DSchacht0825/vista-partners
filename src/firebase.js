import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration
// REPLACE WITH YOUR FIREBASE CONFIG FROM https://console.firebase.google.com
const firebaseConfig = {
  apiKey: "demo-key-replace-with-yours",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let app = null;
let db = null;
let isFirebaseConfigured = false;

// Check if Firebase is properly configured
try {
  if (firebaseConfig.apiKey !== "demo-key-replace-with-yours") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseConfigured = true;
    
    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.log('Multiple tabs open - using memory only');
      } else if (err.code === 'unimplemented') {
        console.log('IndexedDB not supported');
      }
    });
  }
} catch (error) {
  console.log('Firebase not configured yet - using local storage');
  isFirebaseConfigured = false;
}

// Fallback mock database for when Firebase isn't configured
const mockDB = {
  collection: () => ({
    add: () => Promise.resolve({ id: Date.now().toString() }),
    doc: () => ({
      update: () => Promise.resolve(),
      delete: () => Promise.resolve()
    })
  }),
  onSnapshot: (collection, callback) => {
    // Load from localStorage and call callback
    const data = JSON.parse(localStorage.getItem('resourceData') || '[]');
    callback({
      forEach: (fn) => data.forEach((item, index) => fn({ id: item.id || index, data: () => item }))
    });
    
    // Return unsubscribe function
    return () => {};
  }
};

export { db, isFirebaseConfigured };
export default app;