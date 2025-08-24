# Integrating Your Memories Page with Google Cloud and Firebase

This comprehensive guide will show you how to integrate the memories page web application with Google Cloud services, including Firebase Authentication for Google sign-in and Firebase Storage for persistent file storage.

## Overview

The integration involves several key components:
- **Firebase Authentication**: For Google account sign-in
- **Firebase Storage**: For storing photos and videos in the cloud
- **Firestore Database**: For storing memory metadata (titles, descriptions, timestamps)
- **Google Cloud Console**: For managing API credentials and permissions

## Step 1: Set Up Firebase Project

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "my-memories-app")
4. Enable Google Analytics (optional)
5. Create the project

### 1.2 Register Your Web App
1. In your Firebase project dashboard, click "Add app" and select the web icon
2. Enter an app nickname (e.g., "Memories Web App")
3. Check "Set up Firebase Hosting" if you want to deploy
4. Register the app and copy the Firebase configuration

## Step 2: Enable Required Services

### 2.1 Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider
5. Add your authorized domains (localhost for development)

### 2.2 Enable Cloud Storage
1. Go to "Storage" in Firebase Console
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a storage location (preferably close to your users)

### 2.3 Enable Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select a location for your database

## Step 3: Install Firebase SDK

Add Firebase to your existing web application by including the Firebase SDK:

```html
<!-- Firebase App (the core Firebase SDK) is always required -->
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"></script>

<!-- Add Firebase products that you want to use -->
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"></script>
```

Or using ES6 modules:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
```

## Step 4: Configure Firebase in Your App

Create a new file `firebase-config.js`:

```javascript
// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
```

## Step 5: Implement Google Authentication

### 5.1 Add Authentication UI
Modify your existing HTML to include authentication elements:

```html
<!-- Add this to your header -->
<div id="authSection" class="auth-section">
  <div id="signedOut" class="auth-state">
    <button id="signInBtn" class="btn btn--primary">
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google"> 
      Sign in with Google
    </button>
  </div>
  <div id="signedIn" class="auth-state hidden">
    <div class="user-info">
      <img id="userPhoto" class="user-photo" alt="User">
      <span id="userName" class="user-name"></span>
      <button id="signOutBtn" class="btn btn--secondary">Sign Out</button>
    </div>
  </div>
</div>
```

### 5.2 Implement Authentication Logic
Create an `auth-service.js` file:

```javascript
// auth-service.js
import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authCallbacks = [];
    this.init();
  }

  init() {
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.updateUI();
      this.authCallbacks.forEach(callback => callback(user));
    });

    // Set up event listeners
    document.getElementById('signInBtn').addEventListener('click', () => this.signIn());
    document.getElementById('signOutBtn').addEventListener('click', () => this.signOut());
  }

  async signIn() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please try again.');
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  updateUI() {
    const signedOutDiv = document.getElementById('signedOut');
    const signedInDiv = document.getElementById('signedIn');
    const userName = document.getElementById('userName');
    const userPhoto = document.getElementById('userPhoto');

    if (this.currentUser) {
      signedOutDiv.classList.add('hidden');
      signedInDiv.classList.remove('hidden');
      userName.textContent = this.currentUser.displayName;
      userPhoto.src = this.currentUser.photoURL;
    } else {
      signedOutDiv.classList.remove('hidden');
      signedInDiv.classList.add('hidden');
    }
  }

  onAuthStateChange(callback) {
    this.authCallbacks.push(callback);
  }

  isSignedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export default new AuthService();
```

## Step 6: Implement Cloud Storage Integration

### 6.1 Create Storage Service
Create a `storage-service.js` file:

```javascript
// storage-service.js
import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

class StorageService {
  constructor() {
    this.storageRef = ref(storage);
  }

  async uploadFile(file, path) {
    try {
      const fileRef = ref(storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        success: true,
        url: downloadURL,
        path: path
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteFile(path) {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }

  generateFilePath(userId, fileName) {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    return `memories/${userId}/${timestamp}_${fileName}`;
  }
}

export default new StorageService();
```

### 6.2 Create Database Service
Create a `database-service.js` file:

```javascript
// database-service.js
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

class DatabaseService {
  constructor() {
    this.memoriesCollection = collection(db, 'memories');
  }

  async addMemory(memoryData) {
    try {
      const docRef = await addDoc(this.memoriesCollection, {
        ...memoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding memory:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserMemories(userId) {
    try {
      const q = query(
        this.memoriesCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const memories = [];
      querySnapshot.forEach((doc) => {
        memories.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return { success: true, memories };
    } catch (error) {
      console.error('Error getting memories:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteMemory(memoryId) {
    try {
      await deleteDoc(doc(db, 'memories', memoryId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting memory:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new DatabaseService();
```

## Step 7: Update Your Memories App

### 7.1 Modify the MemoriesApp Class
Update your existing `app.js` to integrate with Firebase:

```javascript
// Updated app.js with Firebase integration
import AuthService from './auth-service.js';
import StorageService from './storage-service.js';
import DatabaseService from './database-service.js';

class MemoriesApp {
  constructor() {
    this.memories = [];
    this.currentDeleteId = null;
    this.init();
  }

  init() {
    this.bindEvents();
    
    // Listen for authentication changes
    AuthService.onAuthStateChange((user) => {
      if (user) {
        this.loadUserMemories();
      } else {
        this.memories = [];
        this.updateDisplay();
      }
    });
  }

  async loadUserMemories() {
    if (!AuthService.isSignedIn()) return;

    const user = AuthService.getCurrentUser();
    const result = await DatabaseService.getUserMemories(user.uid);
    
    if (result.success) {
      this.memories = result.memories;
      this.updateDisplay();
    } else {
      this.showToast('Failed to load memories', 'error');
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    if (!AuthService.isSignedIn()) {
      this.showToast('Please sign in to add memories', 'error');
      return;
    }

    const formData = new FormData(e.target);
    const file = formData.get('memoryFile');
    const title = formData.get('memoryTitle');
    const description = formData.get('memoryDescription');

    if (!file || !title) {
      this.showToast('Please fill in required fields', 'error');
      return;
    }

    this.showLoading(true);

    try {
      const user = AuthService.getCurrentUser();
      const filePath = StorageService.generateFilePath(user.uid, file.name);
      const uploadResult = await StorageService.uploadFile(file, filePath);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      const memoryData = {
        userId: user.uid,
        title: title,
        description: description,
        fileUrl: uploadResult.url,
        filePath: uploadResult.path,
        fileName: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'video',
        fileSize: file.size
      };

      const dbResult = await DatabaseService.addMemory(memoryData);
      
      if (dbResult.success) {
        await this.loadUserMemories(); // Refresh the memories list
        this.closeAddModal();
        this.showToast('Memory added successfully!', 'success');
      } else {
        throw new Error(dbResult.error);
      }

    } catch (error) {
      console.error('Error adding memory:', error);
      this.showToast('Failed to add memory', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async confirmDelete() {
    if (!this.currentDeleteId) return;

    try {
      const memory = this.memories.find(m => m.id === this.currentDeleteId);
      if (!memory) return;

      // Delete from storage
      await StorageService.deleteFile(memory.filePath);
      
      // Delete from database
      const result = await DatabaseService.deleteMemory(this.currentDeleteId);
      
      if (result.success) {
        await this.loadUserMemories(); // Refresh the memories list
        this.showToast('Memory deleted successfully!', 'success');
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Error deleting memory:', error);
      this.showToast('Failed to delete memory', 'error');
    } finally {
      this.closeDeleteModal();
    }
  }

  // ... rest of your existing methods
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new MemoriesApp();
});
```

## Step 8: Configure Security Rules

### 8.1 Firestore Security Rules
In the Firebase Console, go to Firestore Database > Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Memories collection rules
    match /memories/{memoryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 8.2 Storage Security Rules
Go to Storage > Rules and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /memories/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 9: Additional Configuration

### 9.1 Add Error Handling and Loading States
Add CSS for loading and error states:

```css
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  z-index: 10000;
}

.toast.success {
  background-color: #10b981;
}

.toast.error {
  background-color: #ef4444;
}

.auth-section {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-photo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
```

### 9.2 Environment Variables
Create a `.env` file for your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 10: Testing and Deployment

### 10.1 Local Testing
1. Make sure you've added `localhost:3000` (or your dev server port) to Firebase Auth authorized domains
2. Test the sign-in flow
3. Test uploading and viewing memories
4. Test deleting memories

### 10.2 Production Deployment
1. Add your production domain to Firebase Auth authorized domains
2. Deploy your app using Firebase Hosting or your preferred hosting service
3. Test all functionality in production environment

## Troubleshooting Common Issues

### CORS Issues
If you encounter CORS issues with Firebase Storage:

```bash
# Install Google Cloud SDK
# Then configure CORS
echo '[{"origin":["http://localhost:3000","https://yourdomain.com"],"method":["GET","POST","PUT","DELETE"],"maxAgeSeconds":3600}]' > cors.json

gsutil cors set cors.json gs://your-bucket-name.appspot.com
```

### Authentication Issues
- Make sure your OAuth consent screen is properly configured
- Verify that your domain is added to authorized domains
- Check that your Firebase API keys are correct

### Storage Permission Issues
- Ensure your Storage Security Rules allow authenticated users to access their own files
- Verify that file paths include the user ID

## Best Practices

1. **Security**: Always validate data on both client and server side
2. **Performance**: Optimize image sizes before uploading
3. **Error Handling**: Provide meaningful error messages to users
4. **Offline Support**: Consider implementing offline capabilities with Firebase caching
5. **Monitoring**: Set up Firebase Analytics and Performance Monitoring

This integration provides a robust, scalable solution for your memories application with Google account authentication and cloud storage capabilities.