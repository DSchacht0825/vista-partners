# Fix Firebase Save Issue

## Quick Solution: Update Firestore Rules

1. Go to **Firebase Console**: https://console.firebase.google.com/project/vista-partners-db/firestore/rules

2. Replace the current rules with these open rules (for development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

## Alternative: Use Local Storage Only

If Firebase continues to have issues, the app will automatically fall back to localStorage. To force localStorage mode:

1. Open `src/firebase.js`
2. Change line 21 to:
```javascript
if (false) { // Force localStorage mode
```

## Testing the Fix

1. Open the app in your browser
2. Click "Add Entry" button
3. Fill in the form fields
4. Click "Save"
5. The entry should appear in the list immediately

## Common Issues & Solutions

### Issue: "Permission denied" error
- **Solution**: Update Firestore rules as shown above

### Issue: Entries save but don't persist after refresh
- **Solution**: Check browser console for Firebase errors
- Clear localStorage: Open browser console and run `localStorage.clear()`

### Issue: Can't connect to Firebase
- **Solution**: Check that your Firebase project is active at https://console.firebase.google.com/

## Need More Help?

Check the browser console (F12 > Console tab) for specific error messages when trying to save.