# Firebase Setup Guide for MOM & CHILD Healthcare Website

## Prerequisites
- A Google account
- Firebase project setup

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `mom-child-healthcare`
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Authentication

1. In your Firebase console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and configure:
     - Project support email: Your email
     - Click "Save"

## Step 3: Set up Firestore Database

1. Go to "Firestore Database" in Firebase console
2. Click "Create database"
3. Start in "test mode" (for development)
4. Choose a location (select closest to your users)
5. Click "Done"

## Step 4: Configure Web App

1. In Firebase console, click the web icon (</>) to add a web app
2. Register app with nickname: "MOM-CHILD-WEB"
3. Don't check "Firebase Hosting" for now
4. Click "Register app"
5. Copy the configuration object

## Step 5: Update Firebase Configuration

Replace the configuration in `firebase-config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 6: Set up Firestore Security Rules

In Firestore console, go to "Rules" tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own medical forms
    match /medical-forms/{formId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 7: Test the Setup

1. Open your website in a browser
2. Try registering a new account
3. Check if the user appears in Firebase Authentication
4. Submit a medical form while logged in
5. Check if the form data appears in Firestore

## Features Included

### Authentication Features:
- **User Registration**: Email/password and Google OAuth
- **User Login**: Email/password and Google OAuth
- **Password Validation**: Strength checking
- **Auto-redirect**: Users are redirected to dashboard when logged in
- **Session Management**: Persistent login sessions

### Database Features:
- **User Profiles**: Stored in Firestore with additional user data
- **Medical Forms**: Submitted forms are saved to user's account
- **Real-time Updates**: Automatic UI updates based on auth state

### Security Features:
- **Firestore Rules**: Data access restricted to authenticated users
- **Input Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management

## File Structure

```
├── index.html          # Main landing page with Firebase integration
├── login.html          # Login page with authentication
├── register.html       # Registration page with form validation
├── dashboard.html      # User dashboard (requires authentication)
├── firebase-config.js  # Firebase configuration and functions
└── README.md          # This setup guide
```

## Troubleshooting

### Common Issues:

1. **Firebase config not working**:
   - Ensure you've replaced the placeholder config with your actual Firebase config
   - Check that all Firebase services are enabled

2. **Authentication not working**:
   - Verify Email/Password and Google providers are enabled
   - Check browser console for specific error messages

3. **Firestore permission denied**:
   - Ensure security rules are properly configured
   - Check that user is authenticated before accessing Firestore

4. **Google Sign-in not working**:
   - Verify Google provider is enabled and configured
   - Check that authorized domains include your domain

### Testing Locally:

For local development, you may need to add `localhost` to authorized domains:

1. Go to Firebase Console > Authentication > Settings
2. Scroll to "Authorized domains"
3. Add `localhost` if testing locally

## Next Steps

1. Configure Firebase Hosting for production deployment
2. Set up Firebase Functions for server-side logic
3. Add Firebase Storage for file uploads
4. Implement push notifications with Firebase Messaging
5. Add Analytics and Crashlytics for monitoring

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Review browser console errors
3. Verify all configuration steps
4. Test with a fresh browser session

Happy coding! 🚀
