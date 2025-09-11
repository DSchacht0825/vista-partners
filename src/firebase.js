import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration
// Your Vista Partners Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBRH1mqIoufRe8dAYNTv1cCyS-I9ajg9iE",
  authDomain: "vista-partners-db.firebaseapp.com",
  projectId: "vista-partners-db",
  storageBucket: "vista-partners-db.firebasestorage.app",
  messagingSenderId: "568281415398",
  appId: "1:568281415398:web:ac6850ab1e6be0610c0527"
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